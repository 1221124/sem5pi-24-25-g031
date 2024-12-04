import {Component, Input} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {PatientService} from '../../../services/patient/patient.service';
import {Router} from '@angular/router';

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
  message: string = '';
  success: boolean = true;
  accessToken: string = '';

  constructor(
    private authService: AuthService,
    private patientService: PatientService
  ){}

}
