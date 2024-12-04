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

}
