import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Staff} from '../../../models/staff.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-specialization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-specialization.component.html',
  styleUrl: './add-specialization.component.css'
})
export class AddSpecializationComponent {

  @Output() closeModalEvent = new EventEmitter<unknown>();

  nameTouched = false;
  descriptionTouched = false;

  closeCreateModal() {
    this.closeModalEvent.emit();
  }

  submitRequest() {

  }

  clearForm() {

  }
}
