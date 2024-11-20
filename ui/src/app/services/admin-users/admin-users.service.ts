import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminUsersService {

  constructor(private http: HttpClient) { }

  async getStaff(filter: any, accessToken: string) {
    let params = new HttpParams();

    if (filter.pageNumber > 0) params = params.set('pageNumber', filter.pageNumber.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ staff: any[], totalItems: number }>(`${environment.staffs}/userIdNull`, options))
      .then(response => {
        if (response.status === 200 && response.body) {

          const mappedStaffs = response.body.staff.map(item => ({
            Id: item.id,
            FullName: {
              FirstName: item.fullName.firstName.value,
              LastName: item.fullName.lastName.value
            },
            licenseNumber: item.licenseNumber.value,
            specialization: item.specialization.toString(),
            staffRole: item.staffRole.toString(),
            ContactInformation: {
              Email: item.contactInformation.email.value,
              PhoneNumber: item.contactInformation.phoneNumber.value
            },
            status: item.status.toString(),
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
          return {
            status: response.status,
            body: {
              staffs: [],
              totalItems: 0
            }
          };
        }
      });
  }
  
}
