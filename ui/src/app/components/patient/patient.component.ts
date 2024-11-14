import { Component } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {PatientService} from '../../services/patient/patient.service';
import {RouterModule} from '@angular/router';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    DatePipe,
    NgIf
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css',
  providers: [AuthService, PatientService]
})
export class PatientComponent {

  constructor(private authorizationService: AuthService, private patientService: PatientService) { }

  token: any;
  patientEmail: any;

  patients: any[] = [];
  firstName: string = '';
  lastName: string = '';
  dateOfBirth: Date = new Date();
  gender: string = '';
  medicalRecordNumber: string = '';
  phoneNumber: string = '';
  email: string = '';
  medicalCondition: string = '';
  emergencyContact: string = '';
  appointmentHistory: string = '';
  userId: string = '';

  ngOnInit(): void {
    this.getPatient();
  }

  getPatient(): void {
    this.token = this.authorizationService.getToken();
    console.log("Token:", this.token);  // Log token
    this.patientEmail = this.authorizationService.extractEmailFromAccessToken(this.token);
    console.log("Extracted Email:", this.patientEmail);  // Log email

    if (this.patientEmail) {
      this.getPatientByEmail(this.patientEmail);
    } else {
      console.error("Email could not be extracted.");
    }
  }

  getPatientByEmail(email: string): void {
    this.patientService.getByEmail(email).subscribe(
      (data) => {
        this.patients = data.map((patient: { appointmentHistory: any[]; }) => ({
          ...patient,
          appointmentHistory: patient.appointmentHistory.map(slot => ({
            start: new Date(slot.start),
            end: new Date(slot.end)
          }))
        }));
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
