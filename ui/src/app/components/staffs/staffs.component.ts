import { Component, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css'
})
export class StaffsComponent {

  firstName: string = '';
  lastName: string = '';
  phoneNumber: string = '';
  specialization: string = '';
  message: string = '';

  firstNameTouched = false;
  lastNameTouched = false;
  phoneNumberTouched = false;
  specializationTouched = false;

  clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.phoneNumber = '';
    this.specialization = '';

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.phoneNumberTouched = false;
    this.specializationTouched = false;
  }

  submitRequest() {


  }
}