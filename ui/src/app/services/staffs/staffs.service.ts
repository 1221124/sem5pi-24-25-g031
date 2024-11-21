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

  async getSlotsAvailability(staffId: string) {
    const url = `${environment.staffs}/slots-availability/${staffId}`;
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
            Id: item.id,
            FullName: {
              FirstName: item.fullName.firstName.value,
              LastName: item.fullName.lastName.value
            },
            licenseNumber: item.licenseNumber.value,
            specialization: item.specialization,
            staffRole: item.staffRole,
            ContactInformation: {
              Email: item.contactInformation.email.value,
              PhoneNumber: item.contactInformation.phoneNumber.value
            },
            status: item.status,
            SlotAppointment: Array.isArray(item.slotAppointment) && item.slotAppointment !== null ?
              item.slotAppointment.map((appointment: { start: string, end: string }) => ({
                Start: appointment.start,
                End: appointment.end
              })) : [],

            SlotAvailability: Array.isArray(item.slotAvailability) && item.slotAvailability !== null ?
              item.slotAvailability.map((availability: { start: string, end: string }) => ({
                Start: availability.start,
                End: availability.end
              })) : []
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

  async deleteStaff(id: string, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };
    return await firstValueFrom(this.http.delete(`${environment.staffs}/${id}`, options));
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
      "staffRole": staff.staffRole
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };

    return await firstValueFrom(this.http.post(environment.staffs, staffDto, options));
  }


  async update(id: string, staff: Staff, accessToken: string) {
    console.log("Updating staff" + id);

    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const staffDto = {
      "email": {
        "value": staff.ContactInformation.Email
      },
      "phoneNumber": {
        "value": staff.ContactInformation.PhoneNumber
      },
      "availabilitySlots": staff.SlotAvailability.map(staff => ({
        "start": staff.Start,
        "end": staff.End
      })),
      "specialization": staff.specialization,
      "pendingPhoneNumber": {
        "value": staff.ContactInformation.PhoneNumber,
      },
      "pendingEmail": {
        "value": staff.ContactInformation.Email,
      },
      "status":staff.status
    };

  console.log(staffDto);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };
    return await firstValueFrom(this.http.put(`${environment.staffs}/update/${staff.ContactInformation.Email}`, staffDto, options));
  }

}
