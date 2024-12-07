import { Component } from '@angular/core';
import { PatientService } from '../../services/patient/patient.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  selector: 'app-verify-patient-sensitive-info',
  templateUrl: './verify-patient-sensitive-info.component.html',
  styleUrl: './verify-patient-sensitive-info.component.css'
})
export class VerifyPatientSensitiveInfoComponent {

  constructor(private service: PatientService, private route: ActivatedRoute, private authService: AuthService) { }

  message: string = '';
  isError: boolean = false;
  
  wait: boolean = true;

  ngOnInit(): void {
    this.authService.message$.subscribe((newMessage) => {
      this.message = newMessage;  
    });
    this.authService.isError$.subscribe((errorStatus) => {
      this.isError = errorStatus;  
    });

    setTimeout(() => {
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        const pendingPhoneNumber = params['pendingPhoneNumber'];
        const pendingEmail = params['pendingEmail'];
        if (token) {
          this.service.verifySensitiveInfo(token, pendingPhoneNumber, pendingEmail)
          .then(async response => {
            if (response.status === 200) {
              this.authService.updateMessage('Sensitive info update verified successfully!');
              this.authService.updateIsError(false);
            } else {
              this.authService.updateMessage('Unexpected status...');
              this.authService.updateIsError(false);
            }
          });
          this.wait = false;
          setTimeout(() => {
            this.authService.redirectToLogin();
          }, 5000);
          return;
        }
      });
    }, 3000);
  }

}