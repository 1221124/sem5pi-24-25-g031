import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../../services/patients/patients.service';
import {RouterModule, RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  providers: [PatientsService]
})

export class PatientsComponent{

  constructor(private patientService: PatientsService) {
  }

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

  firstNameTouched = false;
  lastNameTouched = false;
  dateOfBirthTouched = false;
  genderTouched = false;
  phoneNumberTouched = false;
  emailTouched = false;

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
}
