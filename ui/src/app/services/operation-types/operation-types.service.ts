import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { OperationType } from '../../models/operation-type.model';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationTypesService {
  message: string = '';

  constructor(
    private http: HttpClient
  ) {}

  async getStaffRoles() {
      const url = `${environment.enums}/staffRoles`;
      return await firstValueFrom(this.http.get<string[]>(url));
  }

  async getSpecializations() {
    const url = `${environment.enums}/specializations`;
    return await firstValueFrom(this.http.get<string[]>(url));
  }

  async getStatuses() {
    const url = `${environment.enums}/statuses`;
    return await firstValueFrom(this.http.get<string[]>(url));
  }

  async post(operationType: OperationType, accessToken: string) {

    const dto = {
      "Name": {
        "Value": operationType.Name
      },
      "Specialization": operationType.Specialization,
      "RequiredStaff": operationType.RequiredStaff.map(staff => ({
        "Role": staff.Role,
        "Specialization": staff.Specialization,
        "Quantity": {
          "Value": staff.Quantity
        }
      })),
      "PhasesDuration": "PREPARATION: " + operationType.PhasesDuration.Preparation + ",SURGERY: " + operationType.PhasesDuration.Surgery + ",CLEANING: " + operationType.PhasesDuration.Cleaning,
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.post(environment.operationTypes, dto, options));
  }

  async updateOperationType(id: string, operationType: OperationType, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const dto = {
      "Id": id,
      "Name": {
        "Value": operationType.Name
      },
      "Specialization": operationType.Specialization,
      "RequiredStaff": operationType.RequiredStaff.map(staff => ({
        "Role": staff.Role,
        "Specialization": staff.Specialization,
        "Quantity": {
          "Value": staff.Quantity
        }
      })),
      "PhasesDuration": "PREPARATION: " + operationType.PhasesDuration.Preparation + ",SURGERY: " + operationType.PhasesDuration.Surgery + ",CLEANING: " + operationType.PhasesDuration.Cleaning,
      "Status": operationType.Status
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.put(`${environment.operationTypes}/${id}`, dto, options));
  }

  async getOperationTypes(filter: any, accessToken: string) {
    let params = new HttpParams();

    if (filter.pageNumber > 0) params = params.set('pageNumber', filter.pageNumber.toString());
    if (filter.name !== '') params = params.set('name', filter.name);
    if (filter.specialization !== '') params = params.set('specialization', filter.specialization);
    if (filter.status !== '') params = params.set('status', filter.status);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ operationTypes: any[], totalItems: number }>(`${environment.operationTypes}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {
          const operationTypes = response.body.operationTypes.map(item => ({
            Id: item.id,
            Name: item.name.value,
            Specialization: item.specialization.toString(),
            RequiredStaff: item.requiredStaff.map((staff: { role: any; specialization: any; quantity: { value: any; }; }) => ({
              Role: staff.role,
              Specialization: staff.specialization,
              Quantity: staff.quantity.value
            })),
            PhasesDuration: {
              Preparation: item.phasesDuration.preparation.value,
              Surgery: item.phasesDuration.surgery.value,
              Cleaning: item.phasesDuration.cleaning.value
            },
            Status: item.status.toString()
          }));

          return {
            status: response.status,
            body: {
              operationTypes,
              totalItems: response.body.totalItems
            }
          };
        } else {
          throw new Error('Unexpected response structure or status');
        }
      });
  }

  async getOperationTypeById(id: string, accessToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.get<{ operationType: any }>(`${environment.operationTypes}/${id}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {
          const operationType = response.body.operationType;
          return {
            status: response.status,
            body: {
              Id: operationType.id,
              Name: operationType.name.value,
              Specialization: operationType.specialization.toString(),
              RequiredStaff: operationType.requiredStaff.map((staff: { role: any; specialization: any; quantity: { value: any; }; }) => ({
                Role: staff.role,
                Specialization: staff.specialization,
                Quantity: staff.quantity.value
              })),
              PhasesDuration: {
                Preparation: operationType.phasesDuration.phases.preparation.value,
                Surgery: operationType.phasesDuration.phases.surgery.value,
                Cleaning: operationType.phasesDuration.phases.cleaning.value
              },
              Status: operationType.status.toString()
            }
          };
        } else {
          throw new Error('Unexpected response structure or status');
        }
      });
  }

  async deleteOperationType(id: string, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.delete(`${environment.operationTypes}/${id}`, options));
  }
}
