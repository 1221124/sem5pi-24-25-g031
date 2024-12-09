import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnumsService {

  staffRoles: string[] = [];
  specializations: string[] = [];
  statuses: string[] = [];
  
  constructor(private http: HttpClient) { }

  async getStaffRoles(accessToken: string) {
    if (this.staffRoles.length === 0) {
      const url = `${environment.enums}/staffRoles`;
      const headers = { Authorization: `Bearer ${accessToken}` };
      this.staffRoles = await firstValueFrom(this.http.get<string[]>(url, { headers }));
    }
    return this.staffRoles;
  }

  async getSpecializations(accessToken: string) {
    if (this.specializations.length === 0) {
      const url = `${environment.enums}/specializations`;
      const headers = { Authorization: `Bearer ${accessToken}` };
      this.specializations = await firstValueFrom(this.http.get<string[]>(url, { headers }));
    }
    return this.specializations;
  }

  async getStatuses(accessToken: string) {
    if (this.statuses.length === 0) {
      const url = `${environment.enums}/statuses`;
      const headers = { Authorization: `Bearer ${accessToken}` };
      this.statuses = await firstValueFrom(this.http.get<string[]>(url, { headers }));
      this.statuses = this.statuses.map((status) => status.charAt(0).toUpperCase() + status.slice(1).toLowerCase());
    }
    return this.statuses;
  }
}
