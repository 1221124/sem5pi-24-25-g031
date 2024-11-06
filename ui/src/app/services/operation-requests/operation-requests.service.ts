import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from 'express';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestsService {
  message: string = '';

  constructor(
    private http: HttpClient, private router: Router
  ) {}

  post(staffIdDto: string, patientIdDto: string, operationTypeIdDto: string, deadlineDateDto: Date, priorityDto: string) {
    
    const apiUrl = 'http://localhost:5500/operationRequests';
    
    const creatingOperationRequestDto = {
      staffId: staffIdDto,
      patientId: patientIdDto,
      operationTypeId: operationTypeIdDto,
      deadlineDate: deadlineDateDto.toISOString().split('T')[0],
      priority: priorityDto
    };


    this.http.post(apiUrl, creatingOperationRequestDto).subscribe(
      _response => {
          this.message = 'Operation request submitted successfully!';
      },
      _error => {
          this.message = 'Error submitting operation request. Please try again.';
      }
    );
  };
}
