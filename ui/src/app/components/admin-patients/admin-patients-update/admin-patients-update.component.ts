import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-admin-patients-update',
  templateUrl: './admin-patients-update.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrl: './admin-patients-update.component.css'
})
export class AdminPatientsUpdateComponent {
  @Input() patient!: Patient;

  @Output() close = new EventEmitter<unknown>();
  @Output() update = new EventEmitter<Patient>();


  submit() {

    this.update.emit(this.patient);
  }

  emitCloseModalEvent(){
    this.close.emit();
  }
}
