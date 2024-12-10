import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../services/auth/auth.service';
import {PatientsService} from '../../../services/admin-patients/admin-patients.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-patients-create',
  templateUrl: './admin-patients-create.component.html',
  standalone: true,
  styleUrl: './admin-patients-create.component.css',
  imports: [
    FormsModule,
    NgIf
  ]
})
export class AdminPatientsCreateComponent {
  @Input() patient!: Patient;
  @Output() createPatientEvent = new EventEmitter<Patient>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  constructor(
    private patientService: PatientsService,
  ) {}

  firstName: string = '';
  lastName: string = '';
  dateOfBirth: Date = new Date();
  gender: string = '';
  phoneNumber: number = 0;
  email: string = '';

  // Flags for field touch tracking
  firstNameTouched: boolean = false;
  lastNameTouched: boolean = false;
  dateOfBirthTouched: boolean = false;
  genderTouched: boolean = false;
  phoneNumberTouched: boolean = false;
  emailTouched: boolean = false;

  // Flag to track if the modal is open
  isCreateModalOpen: boolean = false;

  message: string = '';
  success: boolean = false;

  openCreatePatientModal() {
    this.isCreateModalOpen = true;
  }

  closeCreatePatientModal() {
    this.isCreateModalOpen = false;
    this.clearForm(); // Clear form when modal is closed
    this.closeModalEvent.emit(); // Emit event to parent for closing modal
  }

  clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.dateOfBirth = new Date();
    this.gender = '';
    this.phoneNumber = 0;
    this.email = '';
  }

  createPatient() {
    this.patient.FullName = {
      FirstName: this.firstName,
      LastName: this.lastName
    };
    this.patient.DateOfBirth = this.dateOfBirth;
    this.patient.Gender = this.gender;
    this.patient.ContactInformation = {
      Email: this.email,
      PhoneNumber: this.phoneNumber
    };

    this.createPatientEvent.emit(this.patient);

  }
  emitCloseModalEvent() {
    this.closeModalEvent.emit();
  }

}


