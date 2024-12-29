import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Specialization} from '../../../models/specialization.model';
import {Staff} from '../../../models/staff.model';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-update-specialization',
  templateUrl: './update-specialization.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrl: './update-specialization.component.css'
})
export class UpdateSpecializationComponent {
  @Input() specialization!: Specialization;

  @Output() update = new EventEmitter<Specialization>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  closeModal() {
    this.closeModalEvent.emit();
  }

  saveSpecialization() {
    console.log('Updated request:', this.specialization);

    this.update.emit(this.specialization);
  }

}
