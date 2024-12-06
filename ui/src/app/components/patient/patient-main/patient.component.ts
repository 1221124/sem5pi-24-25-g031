import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PatientService } from '../../../services/patient/patient.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Patient } from '../../../models/patient.model';
import {AppModule} from '../../../app.module';
import {CommonModule} from '@angular/common';
import {PatientDetailsComponent} from '../patient-details/patient-details.component';
import {PatientContactInfoComponent} from '../patient-contact-info/patient-contact-info.component';
import {DeleteAccountButtonComponent} from '../delete-account-button/delete-account-button.component';

@Component({
  selector: 'app-patient-main',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  imports: [
    CommonModule,
    PatientDetailsComponent,
    PatientContactInfoComponent,
    DeleteAccountButtonComponent
  ],
  standalone: true
})
export class PatientComponent {
  accessToken: string = '';
  patient: Patient = {
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
    MedicalCondition: [],
    EmergencyContact: 0,
    AppointmentHistory: [],
    UserId: ''
  }


  message: string = '';
  success: boolean = true;

  constructor(
    private authService: AuthService,
    private patientService: PatientService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.handleAuthenticationError('You are not authenticated or are not a patient-main! Please login...');
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('patient')) {
      this.handleAuthenticationError('You are not authorized to access this resource! Redirecting to login...');
      return;
    }

    await this.loadPatientData();
  }

  private async loadPatientData() {
    const email = this.authService.extractEmailFromAccessToken(this.accessToken);
    if (!email) {
      console.error('Email could not be extracted from token.');
      return;
    }

    await this.patientService.getByEmail(email, this.accessToken)
      .then((response) => {
        if (response.status === 200 && response.body) {
          this.patient = response.body.patient;
        } else {
          this.handleError('Failed to load patient-main data. Response status: ' + response.status);
        }
      })
      .catch((error) => {
        this.handleError('Error fetching patient-main data: ' + error.message);
      });
  }

  private handleAuthenticationError(message: string) {
    this.authService.updateMessage(message);
    this.authService.updateIsError(true);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 3000);
  }

  private handleError(message: string) {
    this.message = message;
    this.success = false;
    console.error(message);
  }
}
