import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PatientsService} from '../../../services/admin-patients/admin-patients.service';
import {Patient} from '../../../models/patient.model';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-admin-patients-table',
  templateUrl: './admin-patients-table.component.html',
  styleUrl: './admin-patients-table.component.css',
  imports: [
    NgForOf,
    FormsModule,
    DatePipe
  ],
  standalone: true
})
export class AdminPatientsTableComponent {
  @Input() patients!: Patient[];
  @Input() accessToken!: string;

  constructor(
    private patientService: PatientsService,
    private router: Router,
    private authService: AuthService
  ) {}

  selectedPatient!: Patient;

  patient: Patient[] = [];

  filter = {
    pageNumber: 1,
    fullName: '',
    email: '',
    phoneNumber: '',
    medicalRecordNumber: '',
    dateOfBirth: '',
    gender: ''
  }

  message: string = '';
  success: boolean = true;

  async ngOnInit() {

    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.accessToken = this.authService.getToken();
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.fetchPatients();
    if (this.selectedPatient.AppointmentHistory) {
      this.selectedPatient.AppointmentHistory = this.selectedPatient.AppointmentHistory.map(slot => ({
        Start: new Date(slot.Start),
        End: new Date(slot.End)
      }));
    }
  }

  async fetchPatients() {
    const emptyFilter = {
      pageNumber: 0
    };
    await this.patientService.getPatients(this.accessToken)
      .then(response => {
        if (response.status === 200 && response.body) {
          this.patients = response.body.patient;
        } else {
          this.handleError('Failed to load patients data. Response status: ' + response.status);
        }
      });
  }

  applyFilter() {
    this.refreshPatients();
  }

  clearFilters(): void {
    this.filter = {
      pageNumber: 1,
      fullName: '',
      email: '',
      phoneNumber: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: ''
    };
    this.fetchPatients();  // Fetch all patients again after clearing filters
  }

  async refreshPatients(){
    try {
      this.patients = await this.patientService.getFilterPatients(this.filter, this.accessToken).toPromise();
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      if (httpError.status === 404 || httpError.status === 400) {
        this.patients = [];
        console.warn('No patients found or invalid filter parameters.');
      } else {
        console.error('Error refreshing patients:', error);
      }
    }
  }

  private handleError(message: string) {
    this.message = message;
    this.success = false;
    console.error(message);
  }
}
