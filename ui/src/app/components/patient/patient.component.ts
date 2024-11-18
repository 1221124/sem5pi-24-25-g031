import { Component } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {PatientService} from '../../services/patient/patient.service';
import {Router, RouterModule} from '@angular/router';
import {DatePipe, NgFor, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Patient} from '../../models/patient.model';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgFor,
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
  providers: [AuthService, PatientService]
})
export class PatientComponent {

  constructor(private authorizationService: AuthService, private patientService: PatientService, private router: Router) { }

  accessToken: string = '';
  patientEmail: any;

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

  appointmentHistory: {
    Start: Date,
    End: Date
  }[] = [];

  patients: Patient[] = [];
  filter = {
    pageNumber: 1,
  }
  totalItems: number = 0;
  totalPages: number = 1;

  message: string = '';
  success: boolean = true;


  ngOnInit(): void {
    if (!this.authorizationService.isAuthenticated()) {
      this.authorizationService.updateMessage('You are not authenticated or are not a patient! Please login...');
      this.authorizationService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
    this.accessToken = this.authorizationService.getToken();
    this.getPatient();
  }

  getPatient() {
    this.accessToken = this.authorizationService.getToken();
    this.patientEmail = this.authorizationService.extractEmailFromAccessToken(this.accessToken);

    if (this.patientEmail) {
      this.getPatientByEmail(this.patientEmail);
    } else {
      console.error("Email could not be extracted.");
    }
  }

  async getPatientByEmail(email: string) {
    console.log("Fetching patient by email:", email);
    await this.patientService.getByEmail(email)
      .then(response => {
        if(response.status === 200) {
          if(response.body) {
            this.patient = response.body.patient;
            this.totalPages = Math.ceil(this.totalItems / 2);
          } else {
            this.patients = [];
            this.message = 'Response body is null: ' + response.body;
            this.success = false;
            this.totalItems = 0;
            this.totalPages = 1;
          }
        } else {
          this.patients = [];
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      }).catch(error => {
        if(error.status === 404) {
          this.patients = [];
          this.message = 'Patient not found';
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        } else if (error.status === 401) {
          this.message = 'You are not authorized to view patient information! Please log in...';
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        } else {
          this.patients = [];
          this.message = 'There was an error fetching the patient information: ' + error;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }
}
