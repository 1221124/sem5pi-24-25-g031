import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  message: string = '';

  constructor(
    private http: HttpClient
  ) {}

  async getAll(filter: any, accessToken: string) {
    let params = new HttpParams();

    if (filter.pageNumber > 0) params = params.set('pageNumber', filter.pageNumber.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ appointments: any[], totalItems: number }>(`${environment.appointments}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {
          const appointments = response.body.appointments.map(item => ({
            Id: item.Id,
            RequestCode: item.RequestCode,
            SurgeryRoomNumber: item.SurgeryRoomNumber,
            AppointmentNumber: item.AppointmentNumber,
            AppointmentDate: {
              Start: item.AppointmentDate.Start,
              End: item.AppointmentDate.End
            },
            AssignedStaff: item.assignedStaff.map((staff: { value: any; }) => staff.value)
          }));

          return {
            status: response.status,
            body: {
              appointments,
              totalItems: response.body.totalItems
            }
          };
        } else {
          throw new Error('Unexpected response structure or status');
        }
      }
    );
  }
}
