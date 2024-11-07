import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class PatientsService {
  message: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  post(firstName: string, lastName: string, dateOfBirth: Date, email: string, phoneNumber: number, gender: string) {

    const apiUrl = environment.patients;

    const contactInformation = {
      email: email,
      phoneNumber: phoneNumber
    }

    const fullName = {
      firstName: firstName,
      lastName: lastName
    }

    const creatingPatientDto = {
      fullName: fullName,
      dateOfBirth: dateOfBirth.toISOString().split('T')[0],
      contactInformation: contactInformation,
      gender: gender
    }

    this.http.post(apiUrl, creatingPatientDto).subscribe(
      _response => {
        console.log('Response from API: ', _response);
        this.message = 'Patient created successfully.';
      },
      _error => {
        console.error('Error from API: ', _error);
        this.message = 'An error occurred while creating the patient.';
      }
    );
  }
}


