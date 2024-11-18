import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { Staff } from '../../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class StaffsService {

  private apiUrl = environment.staffs;

  currentPage = 1;
  itemsPerPage = 5;
  totalItems = this.getStaff.length;

  constructor(private http: HttpClient) { }

  async getStaffRoles() {
    const url = `${environment.enums}/staffRoles`;
    return await firstValueFrom(this.http.get<string[]>(url));
  }

  async getSpecializations() {
    const url = `${environment.enums}/specializations`;
    return await firstValueFrom(this.http.get<string[]>(url));
  }

  async getStaff(filter: any, accessToken: string) {
    let params = new HttpParams();

    if (filter.pageNumber > 0) {
      params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.name !== '') params = params.set('name', filter.name);
      if (filter.email !== '') params = params.set('email', filter.email);
      if (filter.specialization !== '') params = params.set('specialization', filter.specialization);

    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ staff: any[], totalItems: number }>(`${environment.staffs}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {

          // Log para verificar a resposta
          console.log('Resposta da API:', response.body);

          // Mapeia os dados dos funcionários
          const mappedStaffs = response.body.staff.map(item => ({
            Id: item.id.value,
            FullName: {
              FirstName: item.fullName.firstName.value,
              LastName: item.fullName.lastName.value
            },
            licenseNumber: item.licenseNumber.toString(),
            specialization: item.specialization.toString(),
            ContactInformation: {
              Email: item.contactInformation.email.value,
              PhoneNumber: item.contactInformation.phoneNumber.value
            },
            status: item.status.toString(),
            SlotAppointement: Array.isArray(item.slotAppointment) && item.slotAppointment !== null ?
              item.slotAppointment.map((appointment: { start: string, end: string }) => ({
                Start: appointment.start,
                End: appointment.end
              })) : [],

            SlotAvailability: Array.isArray(item.slotAvailability) && item.slotAvailability !== null ?
              item.slotAvailability.map((availability: { start: string, end: string }) => ({
                Start: availability.start,
                End: availability.end
              })) : [],
            RoleFirstChar: item.roleFirstChar
          }));

          return {
            status: response.status,
            body: {
              staffs: mappedStaffs,
              totalItems: response.body.totalItems
            }
          };
        } else {
          throw new Error('Estrutura de resposta inesperada ou status diferente de 200');
        }
      });
  }


  deleteStaff(staffEmail: any): Observable<any> {
    console.log('Deleting staff 2:', staffEmail);
    return this.http.delete(`${this.apiUrl}/${staffEmail}`, httpOptions);
  }


  async post(staff: Staff, accessToken: string) {
    const staffDto = {
      "fullName": {
        "firstName": {
          "value": staff.FullName.FirstName
        },
        "lastName": {
          "value": staff.FullName.LastName
        }
      },
      "phoneNumber": {
        "value": staff.ContactInformation.PhoneNumber
      },
      "email": {
        "value": staff.ContactInformation.Email
      },
      "specialization": staff.specialization,
      "roleFirstChar": {
        "value": staff.RoleFirstChar,
      }
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };

    return await firstValueFrom(this.http.post(environment.staffs, staffDto, options));
  }


  async update(id: string, staff: Staff, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const dto = {

    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };
    return await firstValueFrom(this.http.put(`${environment.staffs}/update/${id}`, dto, options));
  }

}
