import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {response} from 'express';

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
}


