import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = environment.patients + '/filter';

  constructor(private http: HttpClient) {
  }

  async getByEmail(email: any, filter: any){
    let params = new HttpParams();

    if (filter.pageNumber > 0) params = params.set('pageNumber', filter.pageNumber.toString());
    if (email) params = params.set('email', email);
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ patient: any[], totalItems: number }>(`${this.apiUrl}`, options))
      .then(response => {
        if(response.status === 200 && response.body){
          const patient = response.body.patient.map(item => ({
            Id: item.id,
            FullName: {
              FirstName: item.FullName.FirstName.Value,
              LastName: item.FullName.FastName.Value
            },
            DateOfBirth: item.DateOfBirth,
            Gender: item.Gender,
            MedicalRecordNumber: item.MedicalRecordNumber.Value,
            ContactInformation: {
              Email: item.ContactInformation.Email.Value,
              PhoneNumber: item.ContactInformation.PhoneNumber.Value
            },
            MedicalCondition: item.medicalConditions.map((patient: { Condition: any; }) => ({
              Condition: patient.Condition
            })),
            EmergencyContact: item.EmergencyContact.Number.Value,
            AppointmentHistory: item.AppointmentHistory.map((slot: { Start: any; End: any; }) => ({
              Start: slot.Start,
              End: slot.End
            })),
            UserId: item.UserId
          }));
          console.log("Mapped patients:", patient);
          return {
            status: response.status,
            body: {
              patient,
              totalItems: response.body.totalItems
            }
          };
        } else {
          throw new Error('Unexpected response structure or status');
        }
      });
  }
}
