import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Staff} from '../../../models/staff.model';

@Component({
  selector: 'app-update-staffs',
  templateUrl: './update-staffs.component.html',
  styleUrl: './update-staffs.component.css'
})
export class UpdateStaffsComponent {
  @Input() isEditModalOpen: boolean = false;
  @Input() staff: Staff;
  @Input() specializations: string[] = [];
  @Input() isEditMode: boolean = false;
  @Output() onCloseModal = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<Staff>();

  closeModal() {
    this.onCloseModal.emit();
  }

  saveStaff() {
    this.onSubmit.emit(this.staff);
  }

  submitRequest() {
    console.log('Submitting staff data', this.staff);
  }
}
