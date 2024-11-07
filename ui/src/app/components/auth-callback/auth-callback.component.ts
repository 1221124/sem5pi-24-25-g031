import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-callback',
  standalone: true,
  templateUrl: './auth-callback.component.html',
  styleUrl: './auth-callback.component.css',
  imports: [
    CommonModule
  ]
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

    const params = await firstValueFrom(this.route.queryParams);
    const code = params['code'] as string;

    if (code) {
      try {
        const tokenResponse = await this.authService.exchangeCodeForToken(code);
        const idToken = tokenResponse?.id_token;
        const accessToken = tokenResponse?.access_token;

        if (idToken && accessToken) {
          const userCallbackResponse = await this.authService.handleUserCallback(idToken, accessToken);

          if (userCallbackResponse.status === 200) {
            if (userCallbackResponse.body == true) {
              try {
                const response = await this.authService.login(accessToken);
                if (response && response.status === 200) {
                  this.authService.login(accessToken);
                  this.authService.updateMessage('Login successful!');
                  this.authService.redirectBasedOnRole(accessToken);
                } else {
                  if (response && response.body) {
                    this.authService.updateMessage('Error during login (not Ok): ' + response.body); 
                    this.authService.updateIsError(true);
                  }
                }
              } catch (error) {
                this.authService.updateMessage('Error during login');  
                this.authService.updateIsError(true);
              }
            } else {
              this.authService.updateMessage('User not found in database, creating user...');  
              this.createUser(accessToken);
            }
          } else {
            this.authService.updateMessage('Error during user callback: ' + userCallbackResponse.body);  
            this.authService.updateIsError(true);
          }
        }
      } catch (error) {
        this.authService.updateMessage('Error during token exchange');  
        this.authService.updateIsError(true);
      }
    } else {
      this.authService.updateMessage('Code not found in query parameters');  
      this.authService.updateIsError(true);
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