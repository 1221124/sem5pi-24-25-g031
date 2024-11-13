import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

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

    try {
      const fragment = window.location.hash;
      const params = new URLSearchParams(fragment.replace('#', ''));
      const accessToken = params.get('access_token');
      
      if (accessToken) {
        console.log('Setting token');
        this.authService.setToken(accessToken);
        console.log('Token set');

        if (this.authService.verifyToken()) {
          console.log('Handling user callback');
          const userCallbackResponse = await this.authService.handleUserCallback(accessToken);
          
          if (userCallbackResponse.status === 200) {
            try {
              const response = await this.authService.login(accessToken);
              if (response.status === 200) {
                console.log('Login successful');
                this.authService.updateMessage('Login successful!');
                this.authService.redirectBasedOnRole(accessToken);
                return;
              } else {
                if (response && response.body) {
                  this.authService.updateMessage('Error during login (not Ok): ' + response.body); 
                  this.authService.updateIsError(true);
                }
              }
            } catch (error) {
              const err = error as Error;
              this.authService.updateMessage('Error during login:' + err.message);
              this.authService.updateIsError(true);
            }
          } else {
            this.authService.updateMessage('Creating user...');
            await this.createUser(accessToken);
            return;
          }
        }

      } else {
        this.authService.updateMessage('Error: Fragment is null');
        this.authService.updateIsError(true);
        return;
      }
    } catch (error) {
      const err = error as Error;
      this.authService.updateMessage('Error during callback: ' + err.message);
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