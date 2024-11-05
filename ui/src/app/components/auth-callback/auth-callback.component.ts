import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-callback',
  template: `<p>Processing your login...</p>`
})
export class AuthCallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
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
                        console.error('Error during login:', error);
                      }
                    });
                  } else {
                    const email = this.authService.extractEmailFromIdToken(idToken) as string;
                    const role = this.authService.extractRoleFromAccessToken(accessToken) as string;
                    if (email == null) {
                      console.error('Email not found in id token');
                      return;
                    } else if (role == null) {
                      console.error('Role not found in access token');
                      return;
                    }
                    this.authService.createUser(email, role).subscribe({
                      next: (response) => {
                        if (response.status === 201) {
                          console.log('User with email ' + email + ' and role ' + role + ' created successfully!');
                          this.router.navigate(['/']);
                        } else {
                          console.error('Bad request during user creation:', response);
                        }
                      },
                      error: (error) => {
                        console.error('Error during user creation:', error);
                      }
                    });
                  }
                },
                error: (error) => {
                  console.error('Error during user verification:', error);
                }
              });
            }
          },
          error: (error) => {
            console.error('Error during token exchange:', error);
          }
        });
      } else {
        console.error('Authorization code not found');
      }
    });
  }
}
