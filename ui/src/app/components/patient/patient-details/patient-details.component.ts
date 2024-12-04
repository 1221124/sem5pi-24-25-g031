import {Component, Input} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {CommonModule, DatePipe} from '@angular/common';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css'],
  imports: [
    DatePipe,
    CommonModule
  ],
  standalone: true
})
export class PatientDetailsComponent {
  @Input() patient!: Patient;
  isEditing: boolean = false;
  editedPatient: any = {};


  openModal(patient: any): void {
    this.isEditing = true;
    this.editedPatient = { ...patient };
  }

  closeModal(): void {
    this.isEditing = false;
    this.editedPatient = {};
  }

  saveChanges(): void {
    console.log('Saving changes:', this.editedPatient);

    this.patient = { ...this.editedPatient };
    this.closeModal();
  }
}
