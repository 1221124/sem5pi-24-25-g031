import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {CommonModule, DatePipe} from '@angular/common';
import {AuthService} from '../../../services/auth/auth.service';
import {PatientService} from '../../../services/patient/patient.service';
import {ActivatedRoute, Router} from '@angular/router';

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
export class PatientDetailsComponent implements OnInit {
  @Input() patient!: Patient;
  @Output() viewMedicalRecord = new EventEmitter<void>();
  @Output() closeMedicalRecord = new EventEmitter<void>();
  
  message: string = '';
  success: boolean = true;
  accessToken: string = '';
  emitOpen: boolean = false;

  constructor(
      private authService: AuthService,
      private router: Router,
  ){}

  ngOnInit(){
    console.log('Patient details:', this.patient);
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    console.log("Access token:", this.accessToken);

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('patient')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }
  }

  emitViewMedicalRecord() {
    console.log('Emitting viewMedicalRecord event:', this.patient);
    this.emitOpen = true;
    this.viewMedicalRecord.emit();
  }

  emitCloseMedicalRecord() {
    console.log('Emitting closeMedicalRecord event:', this.patient);
    this.emitOpen = false;
    this.closeMedicalRecord.emit();
  }
  
}
