import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, firstValueFrom } from 'rxjs';

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

    async handleUserCallback(accessToken: string) {
      const body = {
          accessToken : accessToken
      };
      return await firstValueFrom(this.http.post<any>(`${environment.usersApiUrl}/callback`, body, httpOptions));
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

    async createUser(email: string, role: string): Promise<HttpResponse<any> | null> {
      const dto = {
          email: email,
          role: role
      };
      return await firstValueFrom(this.http.post<HttpResponse<any>>(`${environment.usersApiUrl}`, dto, { observe: 'response', responseType: 'json' }));
    }

    async login(accessToken: string) : Promise<HttpResponse<{ message: string }>> {
      const queryParams = new HttpParams()
        .set('accessToken', accessToken);

      const response = await firstValueFrom(
        this.http.post<{ message: string }>(
          `${environment.usersApiUrl}/login`,
          null,
          { params: queryParams, observe: 'response' }
        )
      );

      return response;
    }

    async redirectBasedOnRole(accessToken: string) {
      const roleFromAccessToken = this.extractRoleFromAccessToken(accessToken) as string;
      const role = roleFromAccessToken.toLowerCase() as string;

      if (role) {
          this.updateMessage('Redirecting to ' + role + ' page...');
          setTimeout(() => {
            this.router.navigateByUrl("/" + role, { replaceUrl: true });
          }, 2000);
      } else {
          this.updateMessage('Redirecting to home page...');
          setTimeout(() => {
            this.router.navigateByUrl("", { replaceUrl: true });
          }, 2000);
      }
    }

    async redirectToLogin() {
      setTimeout(() => {
        this.router.navigateByUrl('', { replaceUrl: true });
      }, 2000);
  }
}