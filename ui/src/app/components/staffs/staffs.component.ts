import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { StaffsService } from '../../services/staffs/staffs.service';
import { first } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css',
  providers: [StaffsService]
})
export class StaffsComponent {

  constructor(private staffService: StaffsService) { }

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  specialization: string = '';
  message: string = '';
  role: string = '';

  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  phoneNumberTouched = false;
  specializationTouched = false;

  clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phoneNumber = '';
    this.specialization = '';
    this.role = '';

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.emailTouched = false;
    this.phoneNumberTouched = false;
    this.specializationTouched = false;
  }

  submitRequest() {
    console.log('submitting request');

    // const creatingStaffDto = {
    //   fullName: {
    //     firstName: this.firstName,
    //     lastName: this.lastName
    //   },
    //   phoneNumber: {
    //     value: this.phoneNumber
    //   },
    //   email: {
    //     value: this.email
    //   },
    //   specialization: {
    //     value: this.specialization
    //   },
    //   roleFirstChar: {
    //     value: this.role  
    //   }
    // };

    console.log('name: ' + this.firstName);
    console.log('last name: ' + this.lastName);
    console.log('email: ' + this.email);
    console.log('phone number: ' + this.phoneNumber);
    console.log('specialization: ' + this.specialization);
    console.log('role: ' + this.role);
    // this.staffService.createStaff(creatingStaffDto).pipe(first()).subscribe(
    this.staffService.createStaff(this.firstName, this.lastName, this.phoneNumber, this.email, this.specialization, this.role);

    console.log("Staff profile submitted");

      // response => {
      //   this.message = 'Staff profile submitted successfully!';
      //   this.clearForm();
      // },
      // error => {
      //   this.message = 'Error submitting staff profile. Please try again.';
      // }
      //);
  }
}