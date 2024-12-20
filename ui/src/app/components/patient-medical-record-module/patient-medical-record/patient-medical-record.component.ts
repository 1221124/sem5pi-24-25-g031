import { Component, Input, OnInit } from '@angular/core';
import { Patient } from '../../../models/patient.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient/patient.service';
import { PatientMedicalRecord } from '../../../models/patient-medical-record.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-medical-record',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './patient-medical-record.component.html',
  styleUrl: './patient-medical-record.component.css'
})
export class PatientMedicalRecordComponent implements OnInit {
  patient: Patient = {
    Id: '',
    FullName: {
      FirstName: '',
      LastName: ''
    },
    DateOfBirth: new Date(),
    Gender: '',
    MedicalRecordNumber: '202412000001',
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

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    if (!this.patient.MedicalRecordNumber) {
      this.patient.MedicalRecordNumber = '202412000001';
    }

    await this.getPatientMedicalRecord();
  }

  async getPatientMedicalRecord() {
    try {
      const patient = await this.patientService.getPatientMedicalRecord(this.patient.MedicalRecordNumber, this.accessToken);
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

}