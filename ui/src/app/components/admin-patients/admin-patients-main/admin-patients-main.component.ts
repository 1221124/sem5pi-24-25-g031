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
import {
  UpdateOperationRequestsComponent
} from '../../operation-requests-main/update-operation-requests/update-operation-requests.component';
import {PatientService} from '../../../services/patient/patient.service';
import { PatientMedicalRecordComponent } from '../../patient-medical-record-module/patient-medical-record/patient-medical-record.component';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { get } from 'http';

@Component({
  selector: 'app-admin-patients-main',
  templateUrl: './admin-patients-main.component.html',
  styleUrl: './admin-patients-main.component.css',
  imports: [
    NgIf,
    FormsModule,
    AdminPatientsTableComponent,
    AdminPatientsCreateComponent,
    AdminPatientsUpdateComponent,
    AdminPatientsDeleteComponent,
    PatientMedicalRecordComponent
  ],
  standalone: true
})
export class AdminPatientsMainComponent {
  @Output() selectedPatientToCreate!: Patient;
  @Output() selectedPatientToUpdate!: Patient;
  @Output() selectedPatientToDelete!: Patient;
  @Output() selectedPatient!: Patient;
  @Output() url: string | undefined;

  patients!: Patient[];

  accessToken: string = '';
  message: string = '';
  success: boolean = true;

  showNotification: boolean = false;

  isCreateModalOpen: boolean = false;
  isEditModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;
  isMedicalRecordModalOpen: boolean = false;

  isDoctor = false;
  role = '';

  hideTable: boolean = false;

  constructor(
    private service: PatientsService,
    private patientService: PatientService,
    private patientMedicalRecordService: PatientMedicalRecordService,
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

    this.role = this.authService.extractRoleFromAccessToken(this.accessToken);

    if (!this.role?.toLowerCase().includes('admin') && !this.role?.toLowerCase().includes('doctor')) {
      this.handleAuthenticationError('You are not authorized to access this resource! Redirecting to login...');
      return;
    }

    this.isDoctor = this.role?.toLowerCase().includes('doctor');

    await this.fetchPatients();
    this.handleRoute();
  }

  handleRoute() {
    this.role = this.role.trim().toLowerCase();
    if (this.router.url.includes('patient-medical-record')) {
      if (!this.patients || !this.route.snapshot.queryParams['patientId']) {
        this.router.navigate([`${this.role}/patients`]);	
        return;
      }
      this.selectedPatient = this.patients.find(patient => patient.Id === this.route.snapshot.queryParams['patientId']);
      if (this.selectedPatient === undefined) {
        this.router.navigate([`${this.role}/patients`]);
        return;
      }
      this.hideTable = true;
      this.isMedicalRecordModalOpen = true;
    }
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
    this.router.navigate(['']);
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
      EmergencyContact: 0,
      UserId: ''
    }
  }
  openUpdateModal(patient: Patient) {

    this.selectedPatientToUpdate = patient;

    this.isEditModalOpen = true;
    this.selectedPatientToUpdate = patient;
  }

  openDeleteModal(patient: Patient) {
    this.selectedPatientToDelete = patient;

    this.isDeleteModalOpen = true;
  }

  openPatientMedicalRecordModal(patient: Patient) {
    this.selectedPatient = patient;
    this.router.navigate(['doctor/patients/patient-medical-record'], { queryParams: { patientId: patient.Id } });
    this.hideTable = true;
    this.isMedicalRecordModalOpen = true;
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
  }

  closeUpdateModal() {
    this.selectedPatientToUpdate = {
      Id: '',
      FullName: {
        FirstName: '',
        LastName: ''
      },
      DateOfBirth: new Date,
      Gender: '',
      MedicalRecordNumber: '',
      ContactInformation: {
        Email: '',
        PhoneNumber: 0
      },
      EmergencyContact: 0,
      UserId: ''
    }

    this.isEditModalOpen = false;
  }

  closeDeleteModal() {
    this.selectedPatientToDelete = {
      Id: '',
      FullName: {
        FirstName: '',
        LastName: ''
      },
      DateOfBirth: new Date,
      Gender: '',
      MedicalRecordNumber: '',
      ContactInformation: {
        Email: '',
        PhoneNumber: 0
      },
      EmergencyContact: 0,
      UserId: ''
    }
    this.isDeleteModalOpen = false;
  }

  closePatientMedicalRecordModal() {
    this.selectedPatient = {
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
    }
    this.isMedicalRecordModalOpen = false;
    this.hideTable = false;
  }

  async createPatient(patient: Patient) {
    this.selectedPatientToCreate = patient;

    await this.service.post(
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
        } else {
          this.displayError('Failed to create patient: ' + response.status);
        }
      })
      .catch(error => {
        this.displayError('Failed to create patient: ' + error);
      }
    );

    await this.fetchPatients();

    const newPatient = this.patients.find(patient => patient.ContactInformation.Email === this.selectedPatientToCreate.ContactInformation.Email);

    await this.patientMedicalRecordService.create(newPatient, this.accessToken)
      .then(response => {
        if (response.status === 200 || response.status === 201) {
          this.success = true;
          this.message = 'Patient medical record created successfully!';

          console.log('Hey, I am here');

          this.closeCreateModal();
          this.fetchPatients();
          this.hideNotificationAfterDelay();
        } else {
          this.displayError('Failed to create patient medical record: ' + response.status);
        }
      }
    );
  }

  updatePatient(patient: Patient) {
    this.selectedPatientToUpdate = patient;

    const formattedPatient = {
      dto: {
        emailId: patient.ContactInformation.Email,
        firstName: patient.FullName.FirstName,
        lastName: patient.FullName.LastName,
        email: patient.ContactInformation.Email,
        phoneNumber: patient.ContactInformation.PhoneNumber,
        emergencyContact: patient.EmergencyContact?.toString(),
        userId: patient.UserId,
      }
    };


    this.service.updatePatient(formattedPatient, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.success = true;
          this.message = 'Patient updated successfully!';

          this.closeUpdateModal();
          this.fetchPatients();
          this.hideNotificationAfterDelay();
        } else {
          this.displayError('Failed to update patient: ' + response.status);
        }
      }).catch(error => {
        this.displayError('Failed to update patient: ' + error);
      });
  }

  async deletePatient(patient: Patient) {

    this.selectedPatientToDelete = patient;

    await this.patientService.deletePatient(patient.ContactInformation.Email, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.success = true;
          this.message = 'Patient deleted successfully!';
        } else {
          this.displayError('Failed to delete patient: ' + response.status);
        }
      }
    );

    const medicalRecord = (await this.patientMedicalRecordService.getPatientMedicalRecord(this.selectedPatientToDelete, this.accessToken)).body.patientMedicalRecord;

    await this.patientMedicalRecordService.deleteMedicalRecord(medicalRecord, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.success = true;
          this.message = 'Patient medical record deleted successfully!';

          this.closeDeleteModal();
          this.fetchPatients();
          this.hideNotificationAfterDelay();
        } else {
          this.displayError('Failed to delete patient medical record: ' + response.status);
        }
      }
    );
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
