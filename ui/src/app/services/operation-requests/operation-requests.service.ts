import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { PatientsService } from '../patients/patients.service';

import { catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestsService {
  message: string = '';

  constructor(
    private http: HttpClient, private router: Router,
    private patientsService: PatientsService
  ) {}

  post(
    staffDto: string, 
    patientDto: string, 
    operationTypeDto: string, 
    deadlineDateDto: Date, 
    priorityDto: string
  ){    
    
    const dto ={ //creatingOperationRequestDto
      "staffId": {
        "value": staffDto
      },
      "patientId": {
        "value": patientDto
      },
      "operationTypeId": {
        "value": operationTypeDto
      },
      "deadlineDate": {
        "date": deadlineDateDto
      },
      "priority": priorityDto
    };

    return this.http.post(environment.operationRequests, dto, httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error submitting Operation Request:', error);
        return throwError(() => new Error('Failed to submit the operation request. Please try again.'));
      })
    );
    
  }

  getAll(){
    return this.http.get<any[]>(environment.operationRequests, httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error fetching Operation Requests:', error);
        return throwError(() => new Error('Failed to fetch operation requests. Please try again.'));
      })
    );
  }

  getPatients(){
    return this.patientsService.getPatients();
  }
}