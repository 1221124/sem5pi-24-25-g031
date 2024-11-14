import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private apiUrl = environment.patients;

  constructor(private http: HttpClient) {
  }

  getByEmail(email: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.get(`${this.apiUrl}/email?email=${email}`, httpOptions);
  }
}
