import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Patient} from '../../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrlEmail = environment.patients + '/email';
  apiUrl = environment.patients;

  constructor(private http: HttpClient) {
  }

  async update(patient: Patient, oldEmail: string, accessToken: string){

    const UpdatingDto = {
      "emailId": { "Value": oldEmail },
      "email": { "value": patient.ContactInformation.Email },
      "phoneNumber": { "value": patient.ContactInformation.PhoneNumber }
    };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };
    return await firstValueFrom(this.http.put(this.apiUrl, UpdatingDto, options));
  }

  async getByEmail(email: any, accessToken: string) {
    let params = new HttpParams();

    if (email) params = params.set('email', email);
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ patient: any}>(`${this.apiUrlEmail}`, options))
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

  async deletePatient(id: string, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.delete(`${environment.patients}/patient/${id}`, options));
  }


}
