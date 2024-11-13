import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { PatientsService } from '../patients/patients.service';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OperationRequest } from '../../models/operation-request.model';
import { formatDate } from '@angular/common';
import { LOCALE_ID, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestsService {
  message: string = '';

  constructor(
    @Inject(LOCALE_ID)
    private locale: string,
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
    const deleteUrl = environment.operationRequests + '/' + id;
    console.log('ID:', id);
    console.log('Delete URL:', deleteUrl);

    return this.http.delete(deleteUrl, httpOptions)
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

    console.log('ID:', idDto);

    const dto = { //updatingOperationRequestDto
      "id": idDto,
      "deadlineDate": {
        "date": deadlineDateDto
      },
      "priority": priorityDto,
      "requestStatus": statusDto
    };

    console.log('Operation Request DTO:', dto);

    return this.http.put(environment.operationRequests, dto, httpOptions)
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

  getPriority(){
    return this.http.get<string[]>(environment.enums, httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error fetching Priority:', error);
        return throwError(() => new Error('Failed to fetch priority. Please try again.'));
      })
    );
  }

  get(
    searchIdDto: string,
    searchLicenseNumber: string,
    searchPatientPatientName: string,
    searchOperationType: string,
    searchDeadlineDate: Date,
    searchPriority: string,
    searchRequestStatus: string
  ){

    let searchUrl = environment.operationRequests + '?';
    const params = [];

    if (searchIdDto) {
      console.log('ID:', searchIdDto);
      params.push('id=' + encodeURIComponent(searchIdDto));
    }
    if (searchLicenseNumber){
      console.log('License Number: ', searchLicenseNumber);
      params.push('licenseNumber=' + encodeURIComponent(searchLicenseNumber))
    }
    if (searchPatientPatientName) {
      console.log('Patient Name:', searchPatientPatientName);
      params.push('patientPatientName=' + encodeURIComponent(searchPatientPatientName));
    }
    if (searchOperationType) {
      console.log('Operation Type:', searchOperationType);
      params.push('operationType=' + encodeURIComponent(searchOperationType));
    }
    if (searchDeadlineDate) {

      const deadlineDate = new Date(searchDeadlineDate);

      const formattedDate = formatDate(searchDeadlineDate, 'yyyy-MM-dd', this.locale);
      console.log('Formatted Date:', formattedDate);
      params.push('deadlineDate=' + encodeURIComponent(formattedDate));
    }
    if (searchPriority) {
      console.log('Priority:', searchPriority);
      params.push('priority=' + encodeURIComponent(searchPriority));
    }
    if (searchRequestStatus) {
      console.log('Request Status:', searchRequestStatus);
      params.push('requestStatus=' + encodeURIComponent(searchRequestStatus));
    }

    // Join all parameters with '&'
    searchUrl += params.join('&');

    console.log('Search URL:', searchUrl);

    return this.http.get<OperationRequest[]>(searchUrl, httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error fetching Operation Request:', error);
        return throwError(() => new Error('Failed to fetch operation request. Please try again.'));
      })
    );
  }
}