import { Component, OnInit } from '@angular/core';
import { VerifyEmailService } from '../../services/verify-email/verify-email.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf],
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit {

  constructor(private service: VerifyEmailService, private route: ActivatedRoute, private authService: AuthService) { }

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
          this.service.verifyEmail(token)
          .then(async response => {
            if (response.status === 200) {
              this.authService.updateMessage('Email verified successfully!');
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