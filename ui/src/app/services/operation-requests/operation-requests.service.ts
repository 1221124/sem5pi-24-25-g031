import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment, httpOptions } from '../../../environments/environment';
import { PatientsService } from '../admin-patients/admin-patients.service';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { OperationRequest } from '../../models/operation-request.model';
import { DatePipe } from '@angular/common';

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

  get(
    searchIdDto: string,
    searchLicenseNumber: string,
    searchPatientName: string,
    searchOperationType: string,
    searchDeadlineDate: string,
    searchPriority: string,
    searchRequestStatus: string
  ){

    let searchUrl = environment.operationRequests + '/filtered?';
    const params = [];

    if (searchIdDto) {
      console.log('ID:', searchIdDto);
      params.push('searchId=' + encodeURIComponent(searchIdDto));
    }

    if (searchLicenseNumber){
      console.log('License Number: ', searchLicenseNumber);
      params.push('searchLicenseNumber=' + encodeURIComponent(searchLicenseNumber))
    }

    if (searchPatientName) {
      console.log('Patient Name:', searchPatientName);
      const nameParts = searchPatientName.trim().split(' ');

      if (nameParts.length === 2) {
        const name = nameParts[0] + '-' + nameParts[1];

        console.log('Name:', name);

        params.push('searchPatientName=' + encodeURIComponent(name));
      }
    }

    if (searchOperationType) {
      console.log('Operation Type:', searchOperationType);
      params.push('searchOperationType=' + encodeURIComponent(searchOperationType));
    }

    if (searchDeadlineDate) {
      console.log("date: " + searchDeadlineDate);
      params.push('searchDeadlineDate=' + encodeURIComponent(searchDeadlineDate));
    }


    if (searchPriority) {
      console.log('Priority:', searchPriority);
      params.push('searchPriority=' + encodeURIComponent(searchPriority));
    }

    if (searchRequestStatus) {
      console.log('Request Status:', searchRequestStatus);
      params.push('searchRequestStatus=' + encodeURIComponent(searchRequestStatus));
    }

    // Join all parameters with '&'
    searchUrl += params.join('&');

    console.log('Search URL:\n', searchUrl);

    return this.http.get<OperationRequest[]>(searchUrl, httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error fetching Operation Request:', error);
        return throwError(() => new Error('Failed to fetch operation request. Please try again.'));
      })
    );
  }

  getRequestStatus(){
    return this.http.get<any[]>(environment.enums + "/requestStatuses", httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error fetching Request Statuses:', error);
        return throwError(() => new Error('Failed to fetch request statuses. Please try again.'));
      })
    );
  }

  getPriority(){
    return this.http.get<any[]>(environment.operationTypes + "/priorities", httpOptions)
    .pipe(
      catchError(error => {
        console.error('Error fetching Priorities:', error);
        return throwError(() => new Error('Failed to fetch priorities. Please try again.'));
      })
    );
  }

  
}