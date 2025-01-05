import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';
import { MedicalConditionService } from '../../../services/medical-condition/medical-condition.service';
import { skip } from 'rxjs';

@Component({
  selector: 'app-medical-condition-table',
  templateUrl: './medical-condition-table.component.html',
  styleUrl: './medical-condition-table.component.css',
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
  ],
  providers: [MedicalConditionService],
  standalone: true
})
export class MedicalConditionTableComponent implements OnInit {
  @Input() medicalConditions!: MedicalCondition[];

  @Output() updateMedicalConditionEvent = new EventEmitter<MedicalCondition>();
  @Output() deleteMedicalConditionEvent = new EventEmitter<MedicalCondition>();


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  accessToken: string = '';

  isProcessing: boolean = false;
  message: string = '';
  success: boolean = false;

  displayMedicalConditions: MedicalCondition[] = [];
  pages = {
    currentPage: 1,
    totalPages: 1
  };

  filter = {
    searchCode: '',
    searchName: '',
    searchDescription: '',
    searchSymptoms: '',
  };

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    if(!this.medicalConditions) {
      this.medicalConditions = [];
    }

    this.displayMedicalConditions = [...this.medicalConditions];
    this.pages.totalPages = Math.ceil(this.displayMedicalConditions.length / 2);
    this.changePage(1, this.medicalConditions);
  }

  changePage1(page: number, ) {
    this.changePage(page, this.medicalConditions);
  }
  
  changePage(page: number, medicalConditions: MedicalCondition[]) {
    this.pages.currentPage = page;
    this.displayMedicalConditions = medicalConditions.slice((page - 1) * 2, page * 2);
  }

  filterMedicalConditions(){
    if(this.isProcessing){
      return;
    }

    this.isProcessing = true;

    if (!this.filter.searchCode && !this.filter.searchName && !this.filter.searchDescription && !this.filter.searchSymptoms) {
      this.displayMedicalConditions = this.medicalConditions;
      this.pages.totalPages = Math.ceil(this.displayMedicalConditions.length / 2);
      this.changePage(1, this.displayMedicalConditions);
      this.isProcessing = false;
      return;
    }

    console.log('this.medicalConditions:', this.medicalConditions);
      
    this.displayMedicalConditions = this.medicalConditions.filter(condition => {
      console.log('Condition:', condition);
      const matchesCode = this.filter.searchCode ? condition.code.includes(this.filter.searchCode) : true;
      const matchesName = this.filter.searchName ? condition.name.includes(this.filter.searchName) : true;
      

      let matchesDescription = true;

      if(this.filter.searchDescription !== ''){
        const searchWords = this.filter.searchDescription.toLowerCase().split(' ');
        const conditionWords = condition.description.toLowerCase().split(' ');
        matchesDescription = searchWords.every(word => conditionWords.includes(word));
      }

      let matchesSymptoms = true;

      if(this.filter.searchSymptoms !== ''){
        const searchWords = this.filter.searchSymptoms.toLowerCase().split(' ');
        console.log('searchWords:', searchWords);
        const conditionWords = condition.commonSymptoms.map(symptom => symptom.toLowerCase());
        console.log('conditionWords:', conditionWords);
        matchesSymptoms = searchWords.every(word => conditionWords.includes(word));
      }
      
      console.log(matchesCode, matchesName, matchesDescription, matchesSymptoms);
      
      if(matchesCode && matchesName && matchesDescription && matchesSymptoms){
        console.log('Matched condition:', condition);
        return true;
      }

      console.log('Did not match condition:', condition);
      return false;
    });

    console.log('Filtered medical conditions:', this.displayMedicalConditions);

    this.pages.totalPages = Math.ceil(this.displayMedicalConditions.length / 2);
    this.changePage(1, this.displayMedicalConditions);
  }

  clear(){
    this.filter = {
      searchCode: '',
      searchName: '',
      searchDescription: '',
      searchSymptoms: '',
    };

    this.displayMedicalConditions = this.medicalConditions;
    this.pages.totalPages = Math.ceil(this.displayMedicalConditions.length / 2);
    this.changePage(1, this.medicalConditions);
    
    this.isProcessing = false;
    this.message = '';
    this.success = false;
  }

}
