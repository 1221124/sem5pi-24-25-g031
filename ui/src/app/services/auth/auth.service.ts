import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
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

    private accessToken = '';

    constructor(
      private http: HttpClient,
      private router: Router
    ) {}

    isAuthWithRole(roles: string[]) {
      const accessToken = this.getToken();
      console.log('Access token:', accessToken);
      if (!this.verifyToken()) {
        return false;
      }
      const role = this.extractRoleFromAccessToken(accessToken);
      if (!role) {
        this.updateMessage('Error getting role: ' + 'Role is empty');
        this.updateIsError(true);
        return false;
      }
      if (roles.length > 0) {
        for (const element of roles) {
          if (element.trim().toLowerCase() === role.trim().toLowerCase()) {
            return true;
          }
        }
      } else {
        return accessToken ? true : false;
      }
      return false;
    }

    getToken() {
      return this.accessToken;
    }

    isA(desiredRole: string) {
      const accessToken = this.getToken();
      if (!this.verifyToken()) {
        return false;
      }
      const role = this.extractRoleFromAccessToken(accessToken);
      if (!role) {
        this.updateMessage('Error getting role: ' + 'Role is empty');
        this.updateIsError(true);
        return false;
      }
      return role.trim().toLowerCase() === desiredRole.trim().toLowerCase();
    }

    async setToken(accessToken: string) {
      this.accessToken = accessToken;
    }

    verifyToken() : boolean {
      return true;
    }

    private clearToken() {
      this.accessToken = '';
    }

    logout() {
      this.clearToken();
      this.http.get(`${environment.authConfig.logoutUrl}`);
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

    async createUser(email: string, role: string, accessToken: string): Promise<HttpResponse<any> | null> {
      const dto = {
          email: email,
          role: role
      };
      return await firstValueFrom(this.http.post<HttpResponse<any>>(`${environment.usersApiUrl}`, dto, { observe: 'response', responseType: 'json', headers: new HttpHeaders({ 'Authorization': `Bearer ${accessToken}` }) }));
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
