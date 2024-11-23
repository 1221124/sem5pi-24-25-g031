import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import {environment, httpOptions} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PatientsService {
  message: string = '';
  private apiUrl = environment.patients;

  constructor(private http: HttpClient) {}

  post(
    firstName: string,
    lastName: string,
    dateOfBirth: Date,
    email: string,
    phoneNumber: string,
    gender: string
  ) {

    const contactInformation = {
      email: email,
      phoneNumber: phoneNumber
    }

    const fullName = {
      firstName: firstName,
      lastName: lastName
    }

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

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post(this.apiUrl, creatingPatientDto, httpOptions).subscribe(
      response =>{
        console.log('Patient created successfully', response);
      },
      error => {
        console.log('Patient:', creatingPatientDto);
        console.error('Error creating patient:', error)
      }
    )
  }

  getFilterPatients(filter: any): Observable<any> {
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

    return this.http.get<any[]>(`${this.apiUrl}/filter`, { params });
  }

  getPatients(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(this.apiUrl, httpOptions);
  }

  updatePatient(patient: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, patient);
  }

  deletePatient(patientId: any): Observable<any>{
    console.log("Deletion Patient ID:", patientId);
    return this.http.delete(`${this.apiUrl}/admin/${patientId}`, httpOptions);
  }

}


