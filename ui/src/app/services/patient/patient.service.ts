import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = environment.patients + '/email';

  constructor(private http: HttpClient) {
  }

  async getByEmail(email: any){
    let params = new HttpParams();

    if (email) params = params.set('email', email);
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ patient: any}>(`${this.apiUrl}`, options))
      .then(response => {
        if(response.status === 200 && response.body){
          const item = response.body.patient;
          const patient = {
            Id: item.id,
            FullName: {
              FirstName: item.fullName.firstName.value,
              LastName: item.fullName.lastName.value
            },
            DateOfBirth: item.dateOfBirth.birthDate,
            Gender: item.gender,
            MedicalRecordNumber: item.medicalRecordNumber.value,
            ContactInformation: {
              Email: item.contactInformation.email.value,
              PhoneNumber: item.contactInformation.phoneNumber.value
            },
            MedicalCondition: item.medicalConditions.map((patient: { condition: any; }) => ({
              Condition: patient.condition
            })),
            EmergencyContact: item.emergencyContact?.number?.value || null,
            AppointmentHistory: item.appointmentHistory.map((slot: { start: any; end: any; }) => ({
              Start: slot.start,
              End: slot.end
            })),
            UserId: item.userId || null
          }
          console.log("Mapped patients:", patient);
          return {
            status: response.status,
            body: {
              patient
            }
          };
        } else {
          throw new Error('Unexpected response structure or status');
        }
      });
  }
}
