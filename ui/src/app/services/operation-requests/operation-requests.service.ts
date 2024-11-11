import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { PatientsService } from '../patients/patients.service';

import { catchError } from 'rxjs/operators';
import { firstValueFrom, throwError } from 'rxjs';
import { OperationRequest } from '../../models/operation-request.model';

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
      "staff": {
        "value": staffDto
      },
      "patient": {
        "value": patientDto
      },
      "operationType": {
        "value": operationTypeDto
      },
      "deadlineDate": {
        "date": deadlineDateDto
      },
      "priority": priorityDto
    };

    console.log('Operation Request DTO:', dto);

    return this.http.post(environment.operationRequests, dto, httpOptions)
    .subscribe(
      response =>{
        console.log('Operation Request created successfully', response);
      },
      error => {
        console.log('Operation Request:', dto);
        console.error('Error creating request:', error)
      }
    )
  }

  delete(id: string){
    return this.http.delete(environment.operationRequests + '/' + id, httpOptions)
    .subscribe(
      response => {
        console.log('Operation Request deleted successfully', response);
      },
      error => {
        console.error('Error deleting request:', error);
      }
    );
  }

  put(
    idDto: string,
    deadlineDateDto: Date,
    priorityDto: string,
    statusDto: string
  ){

    const dto = { //updatingOperationRequestDto
      "deadlineDate": {
        "date": deadlineDateDto
      },
      "priority": priorityDto,
      "status": statusDto
    };

    return this.http.put(environment.operationRequests + '/update/' + idDto, dto, httpOptions)
    .subscribe(
      response => {
        console.log('Operation Request updated successfully', response);
      },
      error => {
        console.error('Error updating request:', error);
    });
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