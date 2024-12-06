import { Component } from '@angular/core';
import { StaffsService } from '../../services/staffs/staffs.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { PatientService } from '../../services/patient/patient.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  selector: 'app-verify-remove-patient',
  templateUrl: './verify-remove-patient.component.html',
  styleUrl: './verify-remove-patient.component.css'
})
export class VerifyRemovePatientComponent {

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
        if (token) {
          this.service.verifyRemoveSensitiveInfo(token)
          .then(async response => {
            if (response.status === 200) {
              this.authService.updateMessage('You were deleted from our system! Sad to see you go...');
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