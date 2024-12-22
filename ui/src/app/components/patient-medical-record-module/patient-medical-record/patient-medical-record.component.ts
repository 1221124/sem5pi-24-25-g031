import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PatientMedicalRecord } from '../../../models/patient-medical-record.model';
import { CommonModule } from '@angular/common';
import { MedicalRecordEntry } from '../../../models/medical-record-entry';
import { MedicalConditionEntryFormComponent } from '../medical-condition-entry-form/medical-condition-entry-form.component';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-patient-medical-record',
  standalone: true,
  imports: [
    CommonModule,
    MedicalConditionEntryFormComponent
  ],
  templateUrl: './patient-medical-record.component.html',
  styleUrl: './patient-medical-record.component.css'
})
export class PatientMedicalRecordComponent implements OnInit {
  @Input() patient: Patient = {
    Id: '',
    FullName: {
      FirstName: '',
      LastName: ''
    },
    DateOfBirth: new Date(),
    Gender: '',
    MedicalRecordNumber: '',
    ContactInformation: {
      Email: '',
      PhoneNumber: 0
    },
    EmergencyContact: 0,
    UserId: ''
  };

  accessToken: string = '';

  patientMedicalRecord: PatientMedicalRecord = {
    Id: '',
    MedicalRecordNumber: '',
    Allergies: [
      {
        ICD11Code: '',
        Date: new Date(),
        notMeaningfulAnymore: false
      }
    ],
    MedicalConditions: [
      {
        ICD11Code: '',
        Date: new Date(),
        notMeaningfulAnymore: false
      }
    ]
  };

  allergyPopup = false;
  medicalConditionPopup = false;

  allergy: MedicalRecordEntry = {
    ICD11Code: '',
    Date: new Date(),
    notMeaningfulAnymore: false
  };

  medicalCondition: MedicalRecordEntry = {
    ICD11Code: '',
    Date: new Date(),
    notMeaningfulAnymore: false
  };

  constructor(
    private service: PatientMedicalRecordService,
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin, a doctor or a patient! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')
    || !this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')
    || !this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('patient')) {
      this.authService.updateMessage('You are not authenticated or are not an admin, a doctor or a patient! Redirecting to login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    await this.getPatientMedicalRecord();
  }

  async getPatientMedicalRecord() {
    try {
      const patient = await this.service.getPatientMedicalRecord(this.patient.MedicalRecordNumber, this.accessToken);
      if (patient.status === 200 && patient.body) {
        this.patientMedicalRecord = patient.body.patientMedicalRecord;
      } else {
        this.authService.updateMessage('Error getting patient medical record: ' + patient.status);
        this.authService.updateIsError(true);
      }
    } catch (error) {
      this.authService.updateMessage('Error getting patient medical record: ' + error);
      this.authService.updateIsError(true);
    }
  }

  openAllergyPopup(allergy?: MedicalRecordEntry) {
    if (allergy) {
      this.allergy = allergy;
    }
    this.location.go('allergy');
    this.allergyPopup = true;
  }

  closeAllergyPopup() {
    this.allergy = {
      ICD11Code: '',
      Date: new Date(),
      notMeaningfulAnymore: false
    };
    this.location.back();
    this.allergyPopup = false;
  }

  openMedicalConditionPopup(medicalCondition?: MedicalRecordEntry) {
    if (medicalCondition) {
      this.medicalCondition = medicalCondition;
    }
    this.location.go('medical-condition');
    this.medicalConditionPopup = true;
  }

  closeMedicalConditionPopup() {
    this.medicalCondition = {
      ICD11Code: '',
      Date: new Date(),
      notMeaningfulAnymore: false
    };
    this.location.back();
    this.medicalConditionPopup = false;
  }

  closePopup() {
    this.authService.updateMessage('');
    this.authService.updateIsError(false);
  }

}