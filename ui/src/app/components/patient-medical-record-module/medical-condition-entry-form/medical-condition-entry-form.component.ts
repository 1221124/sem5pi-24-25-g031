import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MedicalRecordEntry } from '../../../models/medical-record-entry';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { PatientMedicalRecord } from '../../../models/patient-medical-record.model';
import { FormsModule } from '@angular/forms';
import { MedicalConditionService } from '../../../services/medical-condition/medical-condition.service';

@Component({
  selector: 'app-medical-condition-entry-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-condition-entry-form.component.html',
  styleUrl: './medical-condition-entry-form.component.css'
})
export class MedicalConditionEntryFormComponent implements OnInit {
  @Input() medicalCondition: MedicalRecordEntry = {
    ICD11Code: '',
    Date: new Date(),
    notMeaningfulAnymore: false
  };
  @Input() patientMedicalRecord: PatientMedicalRecord = {
    Id: '',
    MedicalRecordNumber: '',
    Allergies: [],
    MedicalConditions: []
  }
  @Output() close = new EventEmitter<void>();
  
  accessToken: string = '';

  message: string = '';
  isError: boolean = false;

  constructor(
    private service: PatientMedicalRecordService,
    private authService: AuthService,
    private medicalConditionService: MedicalConditionService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.router.navigate(['']);
      return;
    }

    if (!this.patientMedicalRecord.Id) {
      this.message = 'Patient medical record not found';
      this.isError = true;
      this.close.emit();
    }
  }

  async saveMedicalCondition() {
    try {
      const response = await this.service.saveMedicalCondition(this.patientMedicalRecord.Id, this.medicalCondition, this.accessToken);
      if (response.status === 200) {
        this.message = 'Medical condition saved successfully';
        this.isError = false;
      }
    } catch {
      this.message = 'Error saving medical condition';
      this.isError = true;
    } finally {
      this.close.emit();
    }
  }

  async validateICD11Code(code: string) {
    return await this.medicalConditionService.validateICD11Code(code, this.accessToken);
  }
}