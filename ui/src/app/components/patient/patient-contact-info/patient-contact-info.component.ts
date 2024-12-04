import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Patient} from '../../../models/patient.model';

@Component({
  selector: 'app-patient-contact-info',
  templateUrl: './patient-contact-info.component.html',
  styleUrls: ['./patient-contact-info.component.css'],
  imports: [
    CommonModule
  ],
  standalone: true
})

export class PatientContactInfoComponent {
  @Input() patient!: Patient;

}
