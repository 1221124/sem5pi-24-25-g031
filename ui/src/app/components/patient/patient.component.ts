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
    FormsModule,
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
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

  showModal: boolean = false;
  editingField: string = '';
  tempEmail: string = '';
  tempPhoneNumber: string = '';

  oldEmail: string = '';

  async ngOnInit() {
    if (!this.authorizationService.isAuthenticated()) {
      this.authorizationService.updateMessage('You are not authenticated or are not a patient! Please login...');
      this.authorizationService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
    this.accessToken = this.authorizationService.getToken() as string;

    if (!this.authorizationService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('patient')) {
      this.authorizationService.updateMessage(
        'You are not authenticated or are not a patient! Redirecting to login...'
      );
      this.authorizationService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    await this.getPatient();
  }

  openEditModal(field: string) {
    this.editingField = field;
    this.showModal = true;

    if (field === 'email') {
      this.tempEmail = this.patient.ContactInformation.Email;
    } else if (field === 'phoneNumber') {
      this.tempPhoneNumber = this.patient.ContactInformation.PhoneNumber.toString();
    }
  }

  closeEditModal() {
    this.showModal = false;
    this.editingField = '';
  }

  async updateField(field: string) {
    this.oldEmail= this.patient.ContactInformation.Email;
    if (field === 'email') {
      this.patient.ContactInformation.Email = this.tempEmail;
    } else if (field === 'phoneNumber') {
      this.patient.ContactInformation.PhoneNumber = parseInt(this.tempPhoneNumber);
    }
    await this.patientService.update(this.patient, this.oldEmail, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Patient information updated successfully!';
          this.success = true;
          this.getPatient();
        } else {
          this.message = 'There was an error updating the patient information: ' + response.body;
          this.success = false;
        }
      }).catch(error => {
        if (error.status === 401) {
          this.message = 'You are not authorized to update Operation Types! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }
        this.message = 'There was an error updating the Operation Type: ' + error;
        this.success = false;
      });
    this.closeEditModal();

  }

  async delete(id: string){
    await this.patientService.deletePatient(id, this.accessToken)
      .then(response => {
        if(response.status === 200){
          this.message = 'Patient deleted successfully!';
          this.success = true;
          //this.getPatient();
        } else {
          this.message = 'There was an error deleting the patient: ' + response.body;
          this.success = false;
        }
      }).catch(error => {
        if (error.status === 401) {
          this.message = 'You are not authorized to delete patients! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }
        this.message = 'There was an error deleting the patient: ' + error;
        this.success = false;
      });
  }

  async getPatient() {
    this.accessToken = this.authorizationService.getToken();
    this.patientEmail = this.authorizationService.extractEmailFromAccessToken(this.accessToken);

    if (this.patientEmail) {
      await this.getPatientByEmail(this.patientEmail);
    } else {
      console.error("Email could not be extracted.");
    }
  }

  async getPatientByEmail(email: string) {
    await this.patientService.getByEmail(email, this.accessToken)
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
