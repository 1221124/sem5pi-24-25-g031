import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {firstValueFrom, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PatientsService {
  message: string = '';
  private apiUrl = environment.patients;

  constructor(private http: HttpClient) {}

  async post(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    email: string,
    phoneNumber: number,
    gender: string,
    accessToken: string
  ) {

    const creatingPatientDto = {
      "fullName": {
        "firstName": {
          "value": firstName
        },
        "lastName": {
          "value": lastName
        }
      },
      "dateOfBirth": {
        "birthDate": dateOfBirth
      },
      "contactInformation": {
        "email": {
          "value": email
        },
        "phoneNumber": {
          "value": phoneNumber
        }
      },
      "gender": gender
    }


    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    })

    const options = { headers, observe: 'response' as const };

    return await firstValueFrom(this.http.post(`${this.apiUrl}`, creatingPatientDto, options))
      .then(response => {

        if(response.status === 200 || response.status === 201){
          return {
            status: response.status,
            body: response.body
          };
        } else {
          return {
            status: response.status,
            body: []
          };
        }
      }).catch(error => {
        console.error('Error creating patient:', error);
        return {
          status: error.status,
          body: []
        };
      });
  }

  getFilterPatients(filter: any, accessToken: string): Observable<any> {
    const params: any = {};

    if(filter.pageNumber > 0){
      params.pageNumber = String(filter.pageNumber);
      if (filter.fullName) params.fullName = filter.fullName;
      if (filter.email) params.email = filter.email;
      if (filter.phoneNumber) params.phoneNumber = filter.phoneNumber;
      if (filter.medicalRecordNumber) params.medicalRecordNumber = filter.medicalRecordNumber;
      if (filter.dateOfBirth) params.dateOfBirth = filter.dateOfBirth;
      if (filter.gender) params.gender = filter.gender;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const httpOptions = { headers, params };

    return this.http.get<any[]>(`${this.apiUrl}/filter`, httpOptions);
  }

  async getPatients(accessToken: string) {

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const httpOptions = { headers, observe: 'response' as const };

    return await firstValueFrom(this.http.get<{ patient: any[]}>(`${this.apiUrl}`, httpOptions))
      .then(response => {
        console.log('Patients fetched ', response.body);
        if(response.status === 200 && response.body){

          const items = response.body.patient;
          const patient = items.map((item: any) => ({
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
          }));
          return {
            status: response.status,
            body: {
              patient
            }
          }
        } else {
          console.log('Failed to fetch patients:', response.status);
          throw new Error('Unexpected response structure or status');
        }
      });
  }


  updatePatient(patient: any, accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const httpOptions = { headers };

    return this.http.put(`${this.apiUrl}`, patient, httpOptions);
  }

  deletePatient(patientId: any, accessToken: string): Observable<any>{
    console.log("Deletion Patient ID:", patientId);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${ accessToken}`
    });
    const httpOptions = { headers };

    return this.http.delete(`${this.apiUrl}/admin/${patientId}`, httpOptions);
  }

}


