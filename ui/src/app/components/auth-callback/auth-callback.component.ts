import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-callback',
  standalone: true,
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css',
  imports: [CommonModule, RouterModule]
})
export class AuthCallbackComponent implements OnInit {
  message: string = '';
  isError: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
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
    const accessToken = params.get('access_token');
    
    if (accessToken) {
      console.log('Setting token');
      this.authService.setToken(accessToken);
      console.log('Token set');

      if (this.authService.verifyToken()) {
        console.log('Handling user callback');
        
        await this.authService.handleUserCallback(accessToken)
        .then(async response => {
          if (response.status === 200) {
            if (response.body?.exists == true) {
              this.authService.updateMessage(response.body.message);
              this.authService.updateIsError(false);
              this.authService.redirectBasedOnRole(accessToken);
              return;
            } else {
              console.log('User does not exist. Creating user...');
              this.authService.updateMessage('User does not exist. Creating user...');
              this.authService.updateIsError(false);
              this.createUser(accessToken, response.body?.message);
              return;
            }
          } else {
            console.log('Unexpected response during user callback: ' + response.body);
            this.authService.updateMessage('Unexpected response during user callback: ' + response.body);  
            this.authService.updateIsError(true);
            return;
          }
        }).catch(error => {
          if (error.status == 400) {
            this.authService.updateMessage('Bad request during user callback: ' + error.body); 
          } else if (error.status == 404) {
            this.authService.updateMessage('User not found');
          } else if (error.status == 401) {
            this.authService.updateMessage('You are not active. Please contact your system administrator.');
          }
          this.authService.updateIsError(true);
          setTimeout(() => {
            this.authService.redirectToLogin();
          }, 5000);
          return;
        });
      } else {
        this.authService.updateMessage('Token verification failed');  
        this.authService.updateIsError(true);
        return;
      }
    }
  }

  private async createUser(accessToken: string, role: string): Promise<void> {

    const email = this.authService.extractEmailFromAccessToken(accessToken);

    if (!email) {
      this.authService.updateMessage('Email not found in access token.');  
      this.authService.updateIsError(true);
      return;
    }

    if (!role) {
      this.authService.updateMessage('Invalid role.');  
      this.authService.updateIsError(true);
      return;
    } else {
      role = role.toLowerCase();
    }

    if (role == 'doctor'
      || role == 'nurse'
      || role == 'technician') {
        this.authService.updateMessage('Please contact your system administrator to create an account.');
        this.authService.updateIsError(false);
        this.authService.redirectToLogin();
        return;
    }

    try {
      const response = await this.authService.createUser(email, role, accessToken);
      if (response?.status === 201) {
        this.authService.updateMessage('User with email ' + email + ' created successfully!');  
        this.authService.updateIsError(false);
        this.authService.redirectBasedOnRole(accessToken);
        return;
      } else {
        this.authService.updateMessage('Bad request during user creation: ' + response?.body);  
        this.authService.updateIsError(true);
      }
    } catch (error) {
      this.authService.updateMessage('Error during user creation');  
      this.authService.updateIsError(true);
    }
  }

}