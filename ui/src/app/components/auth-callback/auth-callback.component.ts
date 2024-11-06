import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-callback',
  template: `<p>Processing your login...</p>`
})
export class AuthCallbackComponent implements OnInit {
  message: string = '';
  isError: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      
      if (code) {
        this.authService.exchangeCodeForToken(code).subscribe({
          next: (response) => {
            const idToken = response.body?.id_token;
            const accessToken = response.body?.access_token;
      
            if (idToken != null && accessToken != null) {
              localStorage.setItem('idToken', idToken);
              localStorage.setItem('accessToken', accessToken);
              
              this.authService.handleUserCallback(idToken, accessToken).subscribe({
                next: (response) => {
                  if (response.status === 200) {
                    this.authService.login(idToken).subscribe({
                      next: () => {
                        this.authService.redirectBasedOnRole(accessToken);
                      },
                      error: (error) => {
                        this.message = 'Error during login: ' + error;
                        this.isError = true;
                      }
                    });
                  } else {
                    const email = this.authService.extractEmailFromIdToken(idToken) as string;
                    const role = this.authService.extractRoleFromAccessToken(accessToken) as string;
                    if (email == null) {
                      this.message = 'Email not found in id token';
                      return;
                    } else if (role == null) {
                      this.message = 'Role not found in access token';
                      return;
                    }
                    this.authService.createUser(email, role).subscribe({
                      next: (response) => {
                        if (response.status === 201) {
                          this.message = 'User with email ' + email + ' created successfully!';
                          //TODO: Handle redirect
                        } else {
                          this.message = 'Bad request during user creation: ' + response.body;
                          this.isError = true;
                        }
                      },
                      error: (error) => {
                        this.message = 'Error during user creation: ' + error;
                        this.isError = true;
                      }
                    });
                  }
                },
                error: (error) => {
                  this.message = 'Error during user callback: ' + error;
                  this.isError = true;
                }
              });
            }
          },
          error: (error) => {
            this.message = 'Error during token exchange: ' + error;
            this.isError = true;
          }
        });
      } else {
        this.message = 'Code not found in query parameters';
        this.isError = true;
      }
    });
  }
}
