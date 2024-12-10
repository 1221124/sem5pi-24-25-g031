import {Component, Output} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {PatientsService} from '../../../services/admin-patients/admin-patients.service';
import {AuthService} from '../../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import {AdminPatientsTableComponent} from '../admin-patients-table/admin-patients-table.component';
import {AdminPatientsDeleteComponent} from '../admin-patients-delete/admin-patients-delete.component';
import {AdminPatientsUpdateComponent} from '../admin-patients-update/admin-patients-update.component';
import {AdminPatientsCreateComponent} from '../admin-patients-create/admin-patients-create.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-patients-main',
  templateUrl: './admin-patients-main.component.html',
  styleUrl: './admin-patients-main.component.css',
  imports: [
    NgIf,
    FormsModule,
    AdminPatientsTableComponent,
    AdminPatientsCreateComponent
  ],
  standalone: true
})
export class AdminPatientsMainComponent {
  @Output() selectedPatientToCreate!: Patient;
  @Output() url: string | undefined;

  patients!: Patient[];

  accessToken: string = '';
  message: string = '';
  success: boolean = true;

  showNotification: boolean = false;

  isCreateModalOpen: boolean = false;

  constructor(
    private service: PatientsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.handleAuthenticationError('You are not authenticated or are not a patient-main! Please login...');
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    const role = this.authService.extractRoleFromAccessToken(this.accessToken);

    if (!role?.toLowerCase().includes('admin')) {
      this.handleAuthenticationError('You are not authorized to access this resource! Redirecting to login...');
      return;
    }

    await this.fetchPatients();
  }

  async fetchPatients(){
    try {
      const response = await this.service.getPatients(this.accessToken);
      console.log('Patients fetched successfully', response);
      this.patients = response.body?.patient || [];
    } catch (error) {
      this.displayError('Failed to load patients: ' + error);
    }
  }

  private handleAuthenticationError(message: string) {
    this.authService.updateMessage(message);
    this.authService.updateIsError(true);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 3000);
  }

  displayError(errorMessage: string) {
    this.success = false;
    this.message = errorMessage;
    this.showNotification = true;
    this.hideNotificationAfterDelay();
  }

  openCreateModal() {
    this.isCreateModalOpen = true;
    this.selectedPatientToCreate = {
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

  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  createPatient(patient: Patient) {
    this.selectedPatientToCreate = patient;

    this.service.post(
      this.selectedPatientToCreate.FullName.FirstName,
      this.selectedPatientToCreate.FullName.LastName,
      this.selectedPatientToCreate.DateOfBirth,
      this.selectedPatientToCreate.ContactInformation.Email,
      this.selectedPatientToCreate.ContactInformation.PhoneNumber,
      this.selectedPatientToCreate.Gender,
      this.accessToken)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          this.success = true;
          this.message = 'Patient created successfully!';

          this.closeCreateModal();
          this.fetchPatients();
          this.hideNotificationAfterDelay();
        } else {
          this.displayError('Failed to create patient: ' + response.status);
        }
      })
      .catch(error => {
        this.displayError('Failed to create patient: ' + error);
      });
  }

  navigateTo(route: string, options?: { queryParams?: any }) {
    this.router
      .navigate([route], {
        relativeTo: this.route,
        queryParams: options?.queryParams,
      })
      .then(r => console.log('Navigated to:', r))
      .catch(err => console.error('Navigation Error:', err));
  }

  navigateToPatientManager() {
    this.router.navigate(['admin/patients']).then(r => console.log('Navigated to patients:', r));
  }


  hideNotificationAfterDelay() {
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }

}
