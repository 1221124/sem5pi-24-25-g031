import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Appointment } from '../../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentsService {
  message: string = '';

  constructor(
    private http: HttpClient
  ) {}

  async getAll(accessToken: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { ...httpOptions, headers };

    return await firstValueFrom(this.http.get<{ appointments: any[], totalItems: number }>(`${environment.appointments}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {
          const appointments = response.body.appointments.map(item => ({
            Id: item.id,
            RequestCode: item.requestCode.value,
            SurgeryRoomNumber: item.surgeryRoomNumber,
            AppointmentNumber: item.appointmentNumber.value,
            AppointmentDate: item.appointmentDate && 
              typeof item.appointmentDate.start === 'string' && 
              typeof item.appointmentDate.end === 'string' 
              ? {
                Start: item.appointmentDate.start,
                End: item.appointmentDate.end
              }
            : {
              Start: '',
              End: ''
            },
            AssignedStaff: Array.isArray(item.assignedStaff) 
            ? item.assignedStaff.map((staff: { value: any }) => staff.value) 
            : [],
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

  async getByStaff(licenseNumber: string, accessToken: string) {
    let params = new HttpParams().set('licenseNumber', licenseNumber);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { ...httpOptions, headers, params };

    return await firstValueFrom(this.http.get<{ appointments: any[], totalItems: number }>(`${environment.appointments}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {
          const appointments = response.body.appointments.map(item => ({
            Id: item.id,
            RequestCode: item.requestCode.value,
            SurgeryRoomNumber: item.surgeryRoomNumber,
            AppointmentNumber: item.appointmentNumber.value,
            AppointmentDate: item.appointmentDate && 
              typeof item.appointmentDate.start === 'string' && 
              typeof item.appointmentDate.end === 'string' 
              ? {
                Start: item.appointmentDate.start,
                End: item.appointmentDate.end
              }
            : {
              Start: '',
              End: ''
            },
            AssignedStaff: Array.isArray(item.assignedStaff) 
            ? item.assignedStaff.map((staff: { value: any }) => staff.value) 
            : [],
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

  async create(appointment: Appointment, accessToken: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const dto = {
      "RequestCode": {
        "Value": appointment.RequestCode
      },
      "SurgeryRoomNumber": appointment.SurgeryRoomNumber,
      "AppointmentDate": {
        "Start": appointment.AppointmentDate.Start,
        "End": appointment.AppointmentDate.End
      },
      "AssignedStaff": appointment.AssignedStaff.map(staff => ({
        "Value": staff
      }))
    };

    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.post(`${environment.appointments}`, dto, options));
  }

  async update(id: string, appointment: Appointment, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const dto = {
      "Id": id,
      "RequestCode": {
        "Value": appointment.RequestCode
      },
      "SurgeryRoomNumber": appointment.SurgeryRoomNumber,
      "AppointmentNumber": {
        "Value": appointment.AppointmentNumber
      },
      "AppointmentDate": {
        "Start": appointment.AppointmentDate.Start,
        "End": appointment.AppointmentDate.End
      },
      "AssignedStaff": appointment.AssignedStaff.map(staff => ({
        "Value": staff
      }))
    };

    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.put(`${environment.appointments}/${appointment.Id}`, dto, options));
  }
}
