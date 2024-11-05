import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    private usersApiUrl = environment.authConfig.usersApiUrl;
    private clientId = environment.authConfig.clientId;
    private clientSecret = environment.authConfig.clientSecret;
    private redirectUri = environment.authConfig.redirectUri;
    private authDomain = environment.authConfig.authDomain;
    private audience = environment.authConfig.audience;

    constructor(private http: HttpClient, private router: Router) {}

    exchangeCodeForToken(code: string) {
        const body = new HttpParams()
        .set('grant_type', 'authorization_code')
        .set('client_id', this.clientId)
        .set('client_secret', this.clientSecret)
        .set('redirect_uri', this.redirectUri)
        .set('code', code)
        .set('scope', 'openid profile email')
        .set('audience', this.audience);

        interface TokenResponse {
            access_token: string;
            id_token: string;
            // [key: string]: any;
        }

        return this.http.post<TokenResponse>(`${this.authDomain}oauth/token`, body, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            observe: 'response'
        });
    }

    handleUserCallback(idToken: string, accessToken: string) {
        return this.http.post<boolean>(`${this.usersApiUrl}/callback`, { idToken, accessToken }, { observe: 'response' });
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
          const roles: string[] = decodedToken['https://api.sarmg031.com/roles'] || [];
          return roles.length > 0 ? roles[0] : null;
        } catch (error) {
          return null;
        }
    }

    createUser(email: string, role: string) {
        const creatingUserDto = {
            email: email,
            role: role
        };
        return this.http.post<HttpResponse<any>>(`${this.usersApiUrl}`, creatingUserDto, { observe: 'response' });
    }

    login(idToken: string) {
        const email = this.extractEmailFromIdToken(idToken);
    
        return this.http.post<HttpResponse<any>>(`${this.usersApiUrl}/login`, {
            email: email
        }, { observe: 'response' });
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
            this.router.navigate([routeMap[role]]);
        } else {
            console.error('Role not found in route map:', role);
            this.router.navigate(['/']);
        }
    }    

    logout() {
        if (localStorage.getItem('accessToken')) {
            localStorage.removeItem('accessToken');
        }
        this.router.navigate(['/']);
    }
}
