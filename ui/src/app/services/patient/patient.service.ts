import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Patient} from '../../models/patient.model';
import { PatientMedicalRecord } from '../../models/patient-medical-record.model';

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
            EmergencyContact: item.emergencyContact?.number?.value || null,
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

  async deletePatient(email: string, accessToken: string) {

    const params = new HttpParams().set('email', email);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers, params};
    return await firstValueFrom(this.http.delete(`${environment.patients}/removePatient`, options));
  }

  async preDeletePatient(id: string, accessToken: string) {
    const guidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!guidRegex.test(id)) {
      throw new Error('Invalid ID format. Please provide a valid GUID.');
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers};
    return await firstValueFrom(this.http.delete(`${environment.patients}/${id}`, options));

  }

  async verifySensitiveInfo(token: string, pendingPhoneNumber: string, pendingEmail: string) {
    var params = new HttpParams();
    if (token) params = params.set('token', token);
    if (pendingPhoneNumber) params = params.set('pendingPhoneNumber', pendingPhoneNumber);
    if (pendingEmail) params = params.set('pendingEmail', pendingEmail);
    return await firstValueFrom(this.http.get<any>(`${environment.patients}/sensitiveInfo`, { ...httpOptions, params: params }));
  }

  async verifyRemoveSensitiveInfo(token: string) {
    var params = new HttpParams();
    if (token) params = params.set('token', token);
    return await firstValueFrom(this.http.get<any>(`${environment.patients}/removePatient`, { ...httpOptions, params: params }));
  }

  async getPatientMedicalRecord(medicalRecordNumber: string, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      const params = new HttpParams().set('medicalRecordNumber', medicalRecordNumber);

      const options = { ...httpOptions, params, headers };
      
      return await firstValueFrom(this.http.get<any>(`${environment.patientMedicalRecord}/medical-record-number`, options))
        .then(response => {
          console.log('Raw API response:', response);
      
          if (!response || !response.body) {
            throw new Error('API response body is empty or undefined.');
          }
    
          const patientMedicalRecord: PatientMedicalRecord = {
            Id: response.body.id || '',
            MedicalRecordNumber: response.body.medicalRecordNumber?.props?.value || '',
            Allergies: response.body.allergies?.map((allergy: any) => ({
              ICD11Code: allergy?.props?.code?.props?.value || '',
              Date: new Date(allergy?.props?.date),
              notMeaningfulAnymore: allergy?.props?.notMeaningfulAnyMore || false
            })) || [],
            MedicalConditions: response.body.medicalConditions?.map((condition: any) => ({
              ICD11Code: condition?.props?.code?.props?.value || '',
              Date: new Date(condition?.props?.date),
              notMeaningfulAnymore: condition?.props?.notMeaningfulAnyMore || false
            })) || []
          };
      
          console.log('Mapped PatientMedicalRecord:', patientMedicalRecord);
      
          return {
            status: response.status,
            body: {
              patientMedicalRecord
            }
          };
        })
        .catch((error: HttpErrorResponse | Error) => {
          console.error('Error during API request:', error);
          throw error;
        });      
    } catch (error) {
      throw new Error('Error getting patient medical record: ' + error);
    }
  }

}
