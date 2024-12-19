import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicalConditionService } from '../../../services/medical-condition.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

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
    searchSymptoms: [],
  };

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    if(!this.medicalConditions) {
      this.medicalConditions = [];
    }

    this.displayMedicalConditions = [];
    this.pages.currentPage = 1;
    this.pages.totalPages = Math.ceil(this.medicalConditions.length / 2);
    this.changePage(this.pages.currentPage);
  }

  changePage(page: number) {
    this.pages.currentPage = page;
    this.displayMedicalConditions = this.medicalConditions.slice((page - 1) * 2, page * 2);
  }

  filterMedicalConditions(){
    console.log("TODO FILTER");
  }

  clear(){
    this.filter = {
      searchCode: '',
      searchName: '',
      searchDescription: '',
      searchSymptoms: [],
    };
  }
  
}
