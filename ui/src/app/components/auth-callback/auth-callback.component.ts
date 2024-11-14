import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
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
        const userCallbackResponse = await this.authService.handleUserCallback(accessToken);
        
        if (userCallbackResponse.status === 200) {
          if (userCallbackResponse.body?.exists == true) {
            const loginResponse = await this.authService.login(accessToken);
            try {
              if (loginResponse.status == 200) {
                console.log('Login successful');
                this.authService.updateMessage('Login successful!');
                this.authService.redirectBasedOnRole(accessToken);
                return;
              } else {
                console.log('Unexpected response during login: ' + loginResponse.body?.message);
                this.authService.updateMessage('Unexpected response during login: ' + loginResponse.body?.message);
                this.authService.updateIsError(true);
                return;
              }
            } catch {
              if (loginResponse.status == 400) {
                this.authService.updateMessage('Bad request during login: ' + loginResponse.body?.message);
                this.authService.updateIsError(true);
                return;
              }
            }
          } else {
            console.log('Creating user...');
            this.authService.updateMessage('Creating user...');
            await this.createUser(accessToken);
            return;
          }
        } else {
          this.authService.updateMessage('Error during user callback: ' + userCallbackResponse.body);  
          this.authService.updateIsError(true);
          return;
        }
      } else {
        this.authService.updateMessage('Token verification failed');  
        this.authService.updateIsError(true);
        return;
      }
    }
  }

  private async createUser(accessToken: string): Promise<void> {

    const email = this.authService.extractEmailFromAccessToken(accessToken);
    const role = this.authService.extractRoleFromAccessToken(accessToken);

    if (!email) {
      this.authService.updateMessage('Email not found in ID token');  
      this.authService.updateIsError(true);
      return;
    }

    if (!role) {
      this.authService.updateMessage('Role not found in access token');  
      this.authService.updateIsError(true);
      return;
    }

    try {
      const response = await this.authService.createUser(email, role);
      if (response.status === 201) {
        this.authService.updateMessage(`User with email ${email} created successfully!`);  
      } else {
        this.authService.updateMessage('Bad request during user creation: ' + response.body);  
        this.authService.updateIsError(true);
      }
    } catch (error) {
      this.authService.updateMessage('Error during user creation');  
      this.authService.updateIsError(true);  
    }
  }

}