import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
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
    
    const dto = { //creatingOperationRequestDto
      staffId: staffIdDto,
      patientId: patientIdDto,
      operationTypeId: operationTypeIdDto,
      deadlineDate: deadlineDateDto,
      priority: priorityDto
    };

    console.log("Submitting to:", environment.operationRequests);

    this.http.post(environment.operationRequests, dto).subscribe(
      response => 
        console.log('Operation request submitted successfully:', response),
      error => 
        console.error('Error submitting operation request:', error)
    );

  };
}
