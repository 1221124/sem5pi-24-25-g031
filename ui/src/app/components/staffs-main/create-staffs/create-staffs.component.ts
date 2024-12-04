import { Component } from '@angular/core';
import {Staff} from '../../../models/staff.model';

@Component({
  selector: 'app-create-staffs',
  templateUrl: './create-staffs.component.html',
  styleUrl: './create-staffs.component.css'
})
export class CreateStaffsComponent {
  staff: Staff = new Staff();
  specializations: string[] = ['Specialization 1', 'Specialization 2'];
  roles: string[] = ['Role 1', 'Role 2'];

  isCreateModalOpen = false;

  openModal() {
    this.isCreateModalOpen = true;
  }

  closeModal() {
    this.isCreateModalOpen = false;
  }

  submitRequest() {
    // Logic for submitting the staff data
    this.staffCreated.emit(this.staff);
    this.closeModal();
  }

  clearForm() {
    this.staff = new Staff(); // Clear the form
  }
}
