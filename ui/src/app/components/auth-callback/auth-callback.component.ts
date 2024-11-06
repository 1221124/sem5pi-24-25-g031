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
    // if (!this.authService.isAuthenticated()) {
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
              // sessionStorage.setItem('access_Token', accessToken);
              // sessionStorage.setItem('id_Token', idToken);
              // sessionStorage.setItem('isLoggedIn', 'true');

              try {
                await this.authService.login(accessToken);
                console.log('Logged in successfully');
                await this.authService.redirectBasedOnRole(accessToken);
              } catch (error) {
                this.handleError('Error during login', error);
              }
            } else {
              await this.createUser(idToken, accessToken);
            }
          }
        } catch (error) {
          this.handleError('Error during token exchange', error);
        }
      } else {
        this.message = 'Code not found in query parameters';
        this.isError = true;
      }
    // }
  }

  private async createUser(idToken: string, accessToken: string): Promise<void> {
    const email = this.authService.extractEmailFromIdToken(idToken);
    const role = this.authService.extractRoleFromAccessToken(accessToken);

    if (!email) {
      this.message = 'Email not found in ID token';
      this.isError = true;
      return;
    }

    if (!role) {
      this.message = 'Role not found in access token';
      this.isError = true;
      return;
    }

    try {
      const response = await this.authService.createUser(email, role);
      if (response.status === 201) {
        this.message = `User with email ${email} created successfully!`;
        // TODO: Handle redirect after successful user creation
      } else {
        this.message = 'Bad request during user creation: ' + response.body;
        this.isError = true;
      }
    } catch (error) {
      this.handleError('Error during user creation', error);
    }
  }

  private handleError(message: string, error: any): void {
    console.error(message, error);
    this.message = message + ': ' + (error?.message || error);
    this.isError = true;
  }
}