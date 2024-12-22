import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Staff} from '../../../models/staff.model';

@Component({
  selector: 'app-add-specialization',
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
