import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PatientMedicalRecord } from '../../../models/patient-medical-record.model';
import { CommonModule } from '@angular/common';
import { MedicalRecordEntry } from '../../../models/medical-record-entry';
import { MedicalConditionEntryFormComponent } from '../medical-condition-entry-form/medical-condition-entry-form.component';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { MedicalConditionService } from '../../../services/medical-condition/medical-condition.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-medical-record',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MedicalConditionEntryFormComponent,
  ],
  templateUrl: './patient-medical-record.component.html',
  styleUrls: ['./patient-medical-record.component.css'],
})
export class PatientMedicalRecordComponent implements OnInit {
  @Input() patient: Patient = {
    Id: '',
    FullName: {
      FirstName: '',
      LastName: '',
    },
    DateOfBirth: new Date(),
    Gender: '',
    MedicalRecordNumber: '',
    ContactInformation: {
      Email: '',
      PhoneNumber: 0,
    },
    EmergencyContact: 0,
    UserId: '',
  };
  @Output() close = new EventEmitter<void>();

  accessToken: string = '';

  patientMedicalRecord: PatientMedicalRecord = {
    Id: '',
    MedicalRecordNumber: '',
    Allergies: [],
    MedicalConditions: [],
  };

  medicalConditionPopup = false;
  medicalCondition: MedicalRecordEntry | null = null;

  searchQuery: string = '';
  filteredMedicalConditions: MedicalRecordEntry[] = [];

  allMedicalConditions: MedicalCondition[] = [];

  medicalRecordLoaded = false;

  constructor(
    private service: PatientMedicalRecordService,
    private medicalConditionService: MedicalConditionService,
    private authService: AuthService,
    private router: Router,
  ) {}

  async ngOnInit() {
    console.log('PatientMedicalRecordComponent initialized');
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin, a doctor, or a patient! Please login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    const role = this.authService
      .extractRoleFromAccessToken(this.accessToken)
      ?.toLowerCase();

    if (
      !role?.includes('admin') &&
      !role?.includes('doctor') &&
      !role?.includes('patient')
    ) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin, a doctor, or a patient! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    await this.getAllMedicalConditions();
    await this.getPatientMedicalRecord();
  }

  async getAllMedicalConditions() {
    try {
      if (this.allMedicalConditions.length === 0) {
        const medicalConditions = await this.medicalConditionService.get(this.accessToken);

        if (medicalConditions.status === 200 && medicalConditions.body) {
          this.allMedicalConditions = medicalConditions.body;
        } else {
          this.authService.updateMessage(
            'Error getting all medical conditions: ' + medicalConditions.status
          );
          this.authService.updateIsError(true);
        }
      }
    } catch (error) {
      this.authService.updateMessage(
        'Error getting all medical conditions: ' + error
      );
      this.authService.updateIsError(true);
    }
  }

  async getPatientMedicalRecord() {
    try {
      const patient = await this.service.getPatientMedicalRecord(
        this.patient,
        this.accessToken
      );

      if (patient.status === 200 && patient.body) {
        this.patientMedicalRecord = patient.body.patientMedicalRecord;
        this.filteredMedicalConditions = [
          ...this.patientMedicalRecord.MedicalConditions,
        ];
        this.medicalRecordLoaded = true;
      } else {
        this.authService.updateMessage(
          'Error getting patient medical record: ' + patient.status
        );
        this.authService.updateIsError(true);
      }
    } catch (error) {
      this.authService.updateMessage(
        'Error getting patient medical record: ' + error
      );
      this.authService.updateIsError(true);
    }
  }

  getMedicalConditionName(ICD11Code: string): string {
    const medicalCondition = this.allMedicalConditions.find(
      (condition) => condition.code === ICD11Code
    );
    return medicalCondition ? medicalCondition.name : 'Unknown';
  }

  searchMedicalConditions() {
    const query = this.searchQuery.toLowerCase();

    this.filteredMedicalConditions = this.patientMedicalRecord.MedicalConditions.filter(
      (condition) =>
        condition.ICD11Code.toLowerCase().includes(query.toLowerCase()) ||
        this.allMedicalConditions.find((medicalCondition) => medicalCondition.code === condition.ICD11Code)?.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  openMedicalConditionPopup(medicalCondition?: MedicalRecordEntry) {
    this.medicalCondition = medicalCondition || null;
    this.medicalConditionPopup = true;
  }

  closeMedicalConditionPopup() {
    this.getPatientMedicalRecord();
    this.medicalCondition = null;
    this.medicalConditionPopup = false;
  }

  closePopup() {
    this.router.navigate(['doctor/patients']);
    this.close.emit();
  }
}