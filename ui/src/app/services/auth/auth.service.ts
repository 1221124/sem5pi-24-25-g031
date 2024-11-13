import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { TokenResponse } from '../../models/token-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private messageSource = new BehaviorSubject<string>('');
    message$ = this.messageSource.asObservable();

    private isErrorSource = new BehaviorSubject<boolean>(false);
    isError$ = this.isErrorSource.asObservable();

    private static authenticated: boolean = false;

    access_token: string = '';

    constructor(private http: HttpClient, private router: Router) {}

    isAuthenticated(): boolean {
      return AuthService.authenticated;
    }

    authenticate(): void {
      AuthService.authenticated = true;
    }

    getToken(): { accessToken: string } {
      return { accessToken: this.access_token };
    }

    setToken(accessToken: string): void {
      this.access_token = accessToken;
    }

    verifyToken() : boolean {
      try {
        const decodedAccessToken: any = jwtDecode(this.access_token);
        if (decodedAccessToken) {
          //TODO: Verify expiration
          return true;
        }
        this.updateMessage('Error decoding token: ' + 'Token is empty');
        this.updateIsError(true);
        return false;
      } catch (error) {
        this.updateMessage('Error verifying token: ' + error);
        this.updateIsError(true);
        return false;
      }
    }

    clearToken(): void {
      this.access_token = '';
    }

    updateMessage(newMessage: string) {
      this.messageSource.next(newMessage);
    }

    updateIsError(errorStatus: boolean) {
      this.isErrorSource.next(errorStatus);
    }

    // async exchangeCodeForToken(code: string) {
    //   const body = new HttpParams()
    //     .set('code', code)
    //     .set('client_id', environment.authConfig.clientId)
    //     .set('client_secret', environment.authConfig.clientSecret)
    //     .set('redirect_uri', environment.authConfig.redirectUri)
    //     .set('grant_type', 'authorization_code')
    //     .set('audience', environment.authConfig.audience)
    //     .set('scope', 'openid email profile');

    //   const headers = new HttpHeaders()
    //     .set('Content-Type', 'application/x-www-form-urlencoded');
      
    //   console.log('Sending request to exchange code for token');
    //   const response = await firstValueFrom(this.http.post<any>(environment.tokenUrl, body, { headers: headers, observe: 'response', responseType: 'json' }));
      
    //   if (response && response.body) {
    //     // console.log('Token response: ' + JSON.stringify(response.body));
    //     console.log('Setting tokens');
    //     this.setTokens(response.body.id_token, response.body.access_token);
    //     console.log('Tokens set');
    //     return;
    //   } else {
    //     this.updateMessage('Token response is empty');
    //     this.updateIsError(true);
    //   }
    //   return;
    // }

    async handleUserCallback(accessToken: string) {
      const body = {
          accessToken : accessToken
      };
      return firstValueFrom(this.http.post<any>(`${environment.usersApiUrl}/callback`, body, {observe: 'response'}));
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
      return firstValueFrom(this.http.post<HttpResponse<any>>(`${environment.usersApiUrl}`, dto, { observe: 'response', responseType: 'json' }));
    }

    async login(accessToken: string) {
      const queryParams = new HttpParams()
        .set('accessToken', accessToken);

      return firstValueFrom(this.http.post<HttpResponse<any>>(`${environment.usersApiUrl}/login`, null, { params: queryParams, observe: 'response'}));
    }

    async redirectBasedOnRole(accessToken: string) {
      const roleFromAccessToken = this.extractRoleFromAccessToken(accessToken) as string;
      const role = roleFromAccessToken.toLowerCase() as string;

      if (role) {
          console.log('Redirecting to ' + role + ' page');
          this.updateMessage('Redirecting to ' + role + ' page...');
          setTimeout(() => {
            this.router.navigateByUrl("/" + role, { replaceUrl: true });
          }, 2000);
      } else {
        console.log('Unable to redirect based on role');
          this.updateMessage('Unable to redirect based on role.\nRedirecting to home page...');
          this.updateIsError(true);
          setTimeout(() => {
            this.router.navigateByUrl("", { replaceUrl: true });
          }, 2000);
      }
    }
}