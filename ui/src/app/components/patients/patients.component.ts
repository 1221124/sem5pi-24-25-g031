import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../../services/patients/patients.service';
import {RouterModule, RouterOutlet} from '@angular/router';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';


@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf, NgOptimizedImage],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  providers: [PatientsService]
})

export class PatientsComponent{

  constructor(private patientService: PatientsService) {
  }
  patients: any[] = [];
  filter = {
    fullName: '',
    email: '',
    phoneNumber: '',
    medicalRecordNumber: '',
    dateOfBirth: '',
    gender: ''
  }
  selectedPatient: any = {
    appointmentHistory: {
      condition: [{start: null, end: null}]
    }
  };

  firstName: string = '';
  lastName: string = '';
  dateOfBirth: Date = new Date();
  gender: string = '';
  medicalRecordNumber: string = '';
  phoneNumber: string = '';
  email: string = '';
  medicalCondition: string = '';
  emergencyContact: string = '';
  appointmentHistory: string = '';
  userId: string = '';
  message: string | undefined;
  emailId: string = '';
  newCondition: string = '';


  firstNameTouched = false;
  lastNameTouched = false;
  dateOfBirthTouched = false;
  genderTouched = false;
  phoneNumberTouched = false;
  emailTouched = false;
  isEditModalOpen = false;
  isCreateModalOpen = false;

  ngOnInit(): void {
    this.fetchPatients();
  }

  // This method is triggered when the user clicks the "edit" button
  editPatient(patient: any) {
    this.selectedPatient = {
      emailId: patient.contactInformation.email,
      firstName: patient.fullName.firstName,
      lastName: patient.fullName.lastName,
      email: patient.contactInformation.email,
      phoneNumber: patient.contactInformation.phoneNumber,
      emergencyContact: patient.emergencyContact || {number: {value: ''} } ,
      appointmentHistory: patient.appointmentHistory || {condition: ''}
    };
    this.isEditModalOpen = true;
    this.isCreateModalOpen = false;
  }

  // Method to add a condition to the appointment history
  addCondition() {
    this.selectedPatient.appointmentHistory.conditions.push({
      start: '',
      end: ''
    });
  }

  // Method to remove a condition from the appointment history
  removeCondition(index: number) {
    this.selectedPatient.appointmentHistory.condition.splice(index, 1);
  }

  // Method to save the updated patient data
  savePatient() {
    this.selectedPatient.appointmentHistory.condition = this.selectedPatient.appointmentHistory.condition.map((slot : any) => ({
      start: slot.start ? new Date(slot.start) : new Date(),
      end: slot.end ? new Date(slot.end) : new Date()
    }));

    this.patientService.updatePatient(this.selectedPatient).subscribe(
      (response) => {
        this.isEditModalOpen = false;
        this.refreshPatients();
      },
      (error) => {
        console.error('Error updating patient:', error);
      }
    );
  }

  // Method to refresh the list of patients
  refreshPatients() {
    this.patientService.getFilterPatients(this.filter).subscribe(
      (data) => {
        this.patients = data; // Update the patients list
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  // Fetch all patients initially or apply the filter
  fetchPatients(): void {
    this.patientService.getPatients().subscribe(
      (data) => {
        this.patients = data;
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  applyFilter(): void {
    this.refreshPatients();
  }

  clearFilters(): void {
    this.filter = {
      fullName: '',
      email: '',
      phoneNumber: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: ''
    };
    this.fetchPatients();  // Fetch all patients again after clearing filters
  }


  createPatient() {
    console.log('Create button clicked');
    this.message = '';

    if (!this.isValidEmail(this.email)) {
      this.message = 'Invalid email format. Please provide a valid email.'
      return;
    }

    if (!this.isValidDate(this.dateOfBirth)) {
      this.message = 'Invalid date of birth. Please provide a valid date of birth.'
      return;
    }

    if(!this.isValidPhoneNumber(this.phoneNumber)) {
      this.message = 'Invalid phone number format. Please provide a valid phine number.'
    }

    this.patientService.post(this.firstName, this.lastName, this.dateOfBirth, this.email, this.phoneNumber, this.gender);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.test(email);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    //const phoneNumberRegex = new RegExp(/^\s{9}$/);
    //return phoneNumberRegex.test(phoneNumber.toString());
    return true;
  }

  isValidDate(date: any): boolean {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date instanceof Date && !isNaN(date.getTime());
  }

  clearForm() {
    console.log('Clear button clicked');
    this.firstName = '';
    this.lastName = '';
    this.dateOfBirth = new Date();
    this.phoneNumber = "";
    this.email = '';
    this.message = '';

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.dateOfBirthTouched = false;
    this.genderTouched = false;
    this.phoneNumberTouched = false;
    this.emailTouched = false;
  }

  openCreatePatientModal() {
    this.selectedPatient = null;
    this.isCreateModalOpen = true;
    this.isEditModalOpen = false;
  }



  closeCreatePatientModal() {
    this.isCreateModalOpen = false;
  }
}
