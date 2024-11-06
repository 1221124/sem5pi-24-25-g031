import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { firstValueFrom } from 'rxjs';

interface TokenResponse {
    access_token: string;
    id_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usersApiUrl = environment.usersApiUrl;
    message: string = '';

    constructor(private http: HttpClient, private router: Router) {}

    async exchangeCodeForToken(code: string): Promise<TokenResponse | null> {
      const body = new HttpParams()
        .set('code', code)
        .set('client_id', environment.authConfig.clientId)
        .set('client_secret', environment.authConfig.clientSecret)
        .set('redirect_uri', environment.authConfig.redirectUri)
        .set('grant_type', 'authorization_code')
        .set('audience', environment.authConfig.audience)
        .set('scope', 'openid email profile');
  
      try {
        const response = await firstValueFrom(this.http
          .post<TokenResponse>(environment.tokenUrl, body, { observe: 'response' }));

        if (response && response.body) {
          return response.body as TokenResponse;
        } else {
          this.message = 'Token response is empty';
          return null;
        }
      } catch (error) {
        this.message = 'Error exchaging token: ' + error;
        return null;
      }
    }

    async handleUserCallback(idToken: string, accessToken: string) {
      const body = {
        AccessToken: accessToken,
        IdToken: idToken
      };
    
      return firstValueFrom(this.http.post<boolean>(`${this.usersApiUrl}/callback`, body, {observe: 'response'}));
    }

    extractEmailFromIdToken(idToken: string): string | null {
      try {
          const decodedToken: any = jwtDecode(idToken);
          return decodedToken.email || null;
      } catch (error) {
          return null;
      }
    }

    extractRoleFromAccessToken(accessToken: string): string | null {
      try {
        const decodedToken: any = jwtDecode(accessToken);
        const roles: string[] = decodedToken[environment.authConfig.audience + '/roles'] || [];
        return roles.length > 0 ? roles[0] : null;
      } catch (error) {
        return null;
      }
    }

    async createUser(email: string, role: string): Promise<HttpResponse<any>> {
      const dto = {
          email: email,
          role: role
      };
      return firstValueFrom(this.http.post<HttpResponse<any>>(`${this.usersApiUrl}`, dto, { observe: 'response' }));
    }

    async login(idToken: string) {
      const emailFromIdToken = this.extractEmailFromIdToken(idToken) as string;

      if (emailFromIdToken == null || emailFromIdToken == '') {
        this.message = 'Email not found in ID token';
        return;
      }

      const email = {
        Value: emailFromIdToken
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      return firstValueFrom(this.http.post<HttpResponse<any>>(`${this.usersApiUrl}/login`, email,
      { observe: 'response', headers, responseType: 'json' }));
    }

    async redirectBasedOnRole(accessToken: string) {
        const role = this.extractRoleFromAccessToken(accessToken) as keyof typeof routeMap;

        const routeMap = {
            admin: '/admin',
            doctor: '/doctor',
            nurse: '/nurse',
            technician: '/technician',
            patient: '/patient'
        };

        if (role && routeMap[role]) {
            this.message = 'Redirecting to ' + routeMap[role] + '...';
            // this.router.navigate([routeMap[role]]);
            this.router.navigate(['/operationRequests']);
        } else {
            this.message = 'Unable to redirect based on role.\nRedirecting to home page...';
            // setTimeout(
            //     () => this.router.navigate(['/']),
            //     5000
            // )
            this.router.navigate(['/operationRequests']);
        }
    }

    // isAuthenticated(): boolean {
    //     return sessionStorage.getItem('isLoggedIn') === 'true';
    // }

    logout() {
      // if (sessionStorage.getItem('isLoggedIn') === 'true') {
      //   sessionStorage.removeItem('isLoggedIn');
      //   sessionStorage.removeItem('access_Token');
      //   sessionStorage.removeItem('id_Token');
      // }
      this.message = 'Goodbye!';
      setTimeout(
        () => this.router.navigate(['/']),
        5000
      );
    }
}