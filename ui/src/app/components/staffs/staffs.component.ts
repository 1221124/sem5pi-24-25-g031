import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { StaffsService } from '../../services/staffs/staffs.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css'
})
export class StaffsComponent {

  constructor(private staffService: StaffsService) { }

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  specialization: string = '';
  message: string = '';

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

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.emailTouched = false;
    this.phoneNumberTouched = false;
    this.specializationTouched = false;
  }

  submitRequest() {
    const creatingStaffDto = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phoneNumber: this.phoneNumber,
      specialization: this.specialization
    };

    this.staffService.createStaff(creatingStaffDto).subscribe(
      response => {
        this.message = 'Operation request submitted successfully!';
      },
      error => {
        this.message = 'Error submitting operation request. Please try again.';
      }
    );
  }
}