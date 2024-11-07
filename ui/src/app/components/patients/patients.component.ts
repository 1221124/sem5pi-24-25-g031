import { Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientsService } from '../../services/patients/patients.service';


@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
  providers: [PatientsService]
})

export class PatientsComponent{

  firstName: string = 'First Name';
  lastName: string = 'Last Name';
  dateOfBirth: Date = new Date("0001-01-01");
  gender: string = 'gender';
  medicalRecordNumber: string = 'Medical Record Number';
  phoneNumber: number = 0;
  email: string = 'Email';
  medicalCondition: string = 'Medical Condition';
  emergencyContact: number = 0;
  appointmentHistory: string = 'Appointment History';
  userId: string = 'User Id';
  message: string | undefined;

  firstNameTouched = false;
  lastNameTouched = false;
  dateOfBirthTouched = false;
  genderTouched = false;
  phoneNumberTouched = false;
  emailTouched = false;

  constructor(private service: PatientsService) {
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

    this.service.post(this.firstName, this.lastName, this.dateOfBirth, this.email, this.phoneNumber, this.gender);
  }

  isValidEmail(email: string): boolean {
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.test(email);
  }

  isValidPhoneNumber(phoneNumber: number): boolean {
    const phoneNumberRegex = new RegExp(/^\d{9}$/);
    return phoneNumberRegex.test(phoneNumber.toString());
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
    this.phoneNumber = 0;
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
