import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffsService } from '../../services/staffs/staffs.service';
import { RouterModule } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css',
  providers: [StaffsService]
})
export class StaffsComponent {

  constructor(private staffService: StaffsService) { }

  staffs: any[] = [];
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  specialization: string = '';
  message: string = '';
  role: string = '';
  selectedStaff: any = null;

  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  phoneNumberTouched = false;
  specializationTouched = false;
  isModalOpen = false;


  ngOnInit() {
    this.staffService.getStaff().subscribe(
      (data) => {
        //console.log('Fetched staffs:', data);
        this.staffs = data;
        //console.log('Staff loaded:, this.staffs');
      },
      (error) => {
        console.error('Error loading staffs:', error);
      }
    );
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

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  currentPage = 1;
  itemsPerPage = 5;

  get totalPages(): number {
    return Math.ceil(this.staffs.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  pagedStaffs(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.staffs.slice(startIndex, endIndex);
  }

  editStaff(staff: any): void {
    // Lógica de edição
  }

  deleteStaff(staff: any): void {
    // Lógica de exclusão
  }

}