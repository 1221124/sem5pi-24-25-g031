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

  async getStaffRoles() {
    if (this.staffRoles.length === 0) {
      const url = `${environment.enums}/staffRoles`;
      this.staffRoles = await firstValueFrom(this.http.get<string[]>(url));
    }
    return this.staffRoles;
  }

  async getSpecializations() {
    if (this.specializations.length === 0) {
      const url = `${environment.enums}/specializations`;
      this.specializations = await firstValueFrom(this.http.get<string[]>(url));
    }
    return this.specializations;
  }

  async getStatuses() {
    if (this.statuses.length === 0) {
      const url = `${environment.enums}/statuses`;
      this.statuses = await firstValueFrom(this.http.get<string[]>(url));
    }
    return this.statuses;
  }
}
