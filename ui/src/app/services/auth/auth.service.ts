import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { catchError, map } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

interface TokenResponse {
    access_token: string;
    id_token: string;
    token_type: string;
    expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usersApiUrl = environment.usersApiUrl;
    message: string = '';
    private tokenUrl = `${environment.authConfig.authDomain}oauth/token`;

    constructor(private http: HttpClient, private router: Router) {}

    exchangeCodeForToken(code: string) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
      
      const body = new HttpParams()
        .set('code', code)
        .set('client_id', environment.authConfig.clientId)
        .set('client_secret', environment.authConfig.clientSecret)
        .set('redirect_uri', environment.authConfig.redirectUri)
        .set('grant_type', 'authorization_code')
        .set('audience', environment.authConfig.audience)
        .set('scope', 'openid email profile');

        return this.http.post<TokenResponse>(`${this.tokenUrl}`, body, {headers, observe: 'response'});
    }

    handleUserCallback(idToken: string, accessToken: string) {
      const body = {
        AccessToken: accessToken,
        IdToken: idToken
      };
    
      return this.http.post<boolean>(`${this.usersApiUrl}/callback`, body, {observe: 'response'});
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

    createUser(email: string, role: string) {
      const dto = {
          email: email,
          role: role
      };
      return this.http.post<HttpResponse<any>>(`${this.usersApiUrl}`, dto, { observe: 'response' });
    }

    login(idToken: string) {
      const email = this.extractEmailFromIdToken(idToken) as string;
  
      return this.http.post<HttpResponse<any>>(`${this.usersApiUrl}/login`, email,
      { observe: 'response' });
    }

    redirectBasedOnRole(accessToken: string): void {
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
            this.router.navigate([routeMap[role]]);
            return;
        } else {
            this.message = 'Unable to redirect based on role.\nRedirecting to home page...';
            setTimeout(
                () => this.router.navigate(['/']),
                5000
            )
        }
    }

    logout() {
        // if (localStorage.getItem('accessToken')) {
        //     localStorage.removeItem('accessToken');
        // }
        this.router.navigate(['/']);
    }
}