import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { access } from 'fs';

interface TokenResponse {
    access_token: string;
    id_token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private messageSource = new BehaviorSubject<string>('');
    message$ = this.messageSource.asObservable();

    private isErrorSource = new BehaviorSubject<boolean>(false);
    isError$ = this.isErrorSource.asObservable();

    constructor(private http: HttpClient, private router: Router) {}

    updateMessage(newMessage: string) {
      this.messageSource.next(newMessage);
    }

    updateIsError(errorStatus: boolean) {
      this.isErrorSource.next(errorStatus);
    }

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
          this.updateMessage('Token response is empty');
          this.updateIsError(true);
          return null;
        }
      } catch (error) {
        this.updateMessage('Error exchanging code for token: ' + error);
        this.updateIsError(true);
        return null;
      }
    }

    async handleUserCallback(idToken: string, accessToken: string) {
      const body = {
        AccessToken: accessToken,
        IdToken: idToken
      };
    
      return firstValueFrom(this.http.post<boolean>(`${environment.usersApiUrl}/callback`, body, {observe: 'response'}));
    }

    extractEmailFromAccessToken(accessToken: string): string | null {
      try {
          const decodedToken: any = jwtDecode(accessToken);
          return decodedToken[environment.authConfig.audience + '/email'] || null;
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
      return firstValueFrom(this.http.post<HttpResponse<any>>(`${environment.usersApiUrl}`, dto, { observe: 'response' }));
    }

    async login(accessToken: string) {
      const emailFromAccessToken = this.extractEmailFromAccessToken(accessToken) as string;

      if (emailFromAccessToken == null || emailFromAccessToken == '') {
        this.updateMessage('Email not found in ID token');
        this.updateIsError(true);
        return;
      }

      const email = {
        Value: emailFromAccessToken
      };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });
  
      return firstValueFrom(this.http.post<HttpResponse<any>>(`${environment.usersApiUrl}/login`, email,
      { observe: 'response', headers, responseType: 'json' }));
    }

    async redirectBasedOnRole(accessToken: string) {
        const routeMap = {
            admin: '/admin',
            doctor: '/doctor',
            nurse: '/nurse',
            technician: '/technician',
            patient: '/patient'
        };

        const roleFromAccessToken = this.extractRoleFromAccessToken(accessToken) as string;
        const role = roleFromAccessToken.toLowerCase() as keyof typeof routeMap;

        if (role && routeMap[role]) {
            this.updateMessage('Redirecting to ' + routeMap[role]);
            // this.router.navigate([routeMap[role]]);
            await this.router.navigate(['/staffs']);
        } else {
            this.updateMessage('Unable to redirect based on role.\nRedirecting to home page...');
            this.updateIsError(true);
            // setTimeout(
            //     () => this.router.navigate(['/']),
            //     5000
            // )
            await this.router.navigate(['/staffs']);
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
      this.updateMessage('Logging out...');
      setTimeout(
        () => this.router.navigate(['/']),
        5000
      );
    }
}