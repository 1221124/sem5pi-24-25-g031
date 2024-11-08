import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestsService {
  message: string = '';

  constructor(
    private http: HttpClient, private router: Router
  ) {}

  post(
    staffIdDto: string, 
    patientIdDto: string, 
    operationTypeIdDto: string, 
    deadlineDateDto: Date, 
    priorityDto: string
  ){    
    
    const dto ={ //creatingOperationRequestDto
      "staffId": {
        "value": staffIdDto
      },
      "patientId": {
        "value": patientIdDto
      },
      "operationTypeId": {
        "value": operationTypeIdDto
      },
      "deadlineDate": {
        "date": deadlineDateDto
      },
      "priority": priorityDto
    };


    const httpOptions2 = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

  return this.http.post(environment.operationRequests, dto, httpOptions2)
      .subscribe(
          response =>{ 
            console.log('Operation Request submitted successfully:', response);
          },
          error => {
            console.log('Operation Request:', dto);
            console.error('Error submitting Operation Request:', error)
          }
      );;
  }
}
