import { Component } from '@angular/core';
import { StaffsService } from '../../services/staffs/staffs.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { PatientService } from '../../services/patient/patient.service';
import {async, firstValueFrom} from 'rxjs';
import { PatientMedicalRecordService } from '../../services/patient-medical-record/patient-medical-record.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  selector: 'app-verify-remove-patient',
  templateUrl: './verify-remove-patient.component.html',
  styleUrl: './verify-remove-patient.component.css'
})
export class VerifyRemovePatientComponent {

  constructor(private service: PatientService, private medicalRecordService: PatientMedicalRecordService, private route: ActivatedRoute, private authService: AuthService) { }

  message: string = '';
  isError: boolean = false;

  wait: boolean = true;

  async ngOnInit() {
    this.authService.message$.subscribe((newMessage) => {
      this.message = newMessage;
    });
    this.authService.isError$.subscribe((errorStatus) => {
      this.isError = errorStatus;
    });

      const fragment = await firstValueFrom(this.route.fragment);
      if (!fragment) {
        return;
      }
      const params = new URLSearchParams(fragment);
      const token = params.get('access_token');

        if (token) {
          const email = this.authService.extractEmailFromAccessToken(token) as string;
          this.service.deletePatient(email, token)
          .then(async response => {
            const patient = (await this.service.getByEmail(email, token)).body.patient;
            const medicalRecord = (await this.medicalRecordService.getPatientMedicalRecord(patient, token)).body.patientMedicalRecord;
            await this.medicalRecordService.deleteMedicalRecord(medicalRecord, token)
            .then(response => {
              if (response.status === 200 || response.status === 204) {
                this.authService.updateMessage('You were deleted from our system! Sad to see you go...');
                this.authService.updateIsError(false);
              } else {
                this.authService.updateMessage('Unexpected status...');
                this.authService.updateIsError(false);
              }
            })
          });
          this.wait = false;
          setTimeout(() => {
            this.authService.redirectToLogin();
          }, 5000);
          return;
        }
  }

}
