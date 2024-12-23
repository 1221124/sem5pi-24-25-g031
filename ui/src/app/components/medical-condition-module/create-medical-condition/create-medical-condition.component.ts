import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-medical-condition',
  templateUrl: './create-medical-condition.component.html',
  styleUrl: './create-medical-condition.component.css',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
  ],
  providers: []
})
export class CreateMedicalConditionComponent implements OnInit {
  @Input() medicalCondition!: MedicalCondition;
  @Output() createNewMedicalConditionEvent = new EventEmitter<MedicalCondition>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
      private router: Router
  ){}

  accessToken: string = '';
  success: boolean = false;
  message: string = '';

  isProcessing: boolean = false;
  
  codeTouched: boolean = false;
  nameTouched: boolean = false;
  descriptionTouched: boolean = false;
  commonSymptomsTouched: boolean = false;

  selectedMedicalConditionCode: string = '';
  selectedMedicalConditionName: string = '';
  selectedMedicalConditionDescription: string = '';
  selectedMedicalConditionCommonSymptoms: string[] = [];

  newSymptom: string = '';

  ngOnInit() {
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
  }

  addSymptom() {
    console.log("new symptom: ", this.newSymptom);
    if (this.newSymptom.trim() === '') {
      console.log('Cannot add an empty symptom!');
      return;
    }

    this.selectedMedicalConditionCommonSymptoms.push(this.newSymptom.trim());
    this.newSymptom = ''; // Clear the temporary input field after adding
  }

  removeSymptom(index: number) {
    this.selectedMedicalConditionCommonSymptoms.splice(index, 1); 
  }

  submit() {
    if (this.isProcessing) {
      console.log('Already processing...');
      return;
    }

    this.isProcessing = true;

    if(!this.selectedMedicalConditionCode || 
      !this.selectedMedicalConditionName || 
      !this.selectedMedicalConditionDescription || 
      !this.selectedMedicalConditionCommonSymptoms
    ) { 
      this.isProcessing = false;
      console.log('Missing fields...');
      console.log('Medical Condition Code: ', this.selectedMedicalConditionCode);
      console.log('Medical Condition Name: ', this.selectedMedicalConditionName);
      console.log('Medical Condition Description: ', this.selectedMedicalConditionDescription);
      console.log('Medical Condition Common Symptoms: ', this.selectedMedicalConditionCommonSymptoms);
      return; 
    }

    this.medicalCondition.code = this.selectedMedicalConditionCode;
    this.medicalCondition.name = this.selectedMedicalConditionName;
    this.medicalCondition.description = this.selectedMedicalConditionDescription;
    this.medicalCondition.commonSymptoms = [...this.selectedMedicalConditionCommonSymptoms];

    console.log('Medical Condition: ', this.medicalCondition);
    this.createNewMedicalConditionEvent.emit(this.medicalCondition);


    console.log('Updating query params...');
    this.router.navigate([],{
      relativeTo: this.route,
      queryParams: {
        code: this.medicalCondition.code,
        name: this.medicalCondition.name,
        description: this.medicalCondition.description,
        commonSymptoms: this.medicalCondition.commonSymptoms
      },
      queryParamsHandling: 'merge'
    });

    setTimeout(() => {
      this.isProcessing = false;
    }, 5000);
  }

  emitCloseModalEvent() {
    this.closeModalEvent.emit();
  }
}
