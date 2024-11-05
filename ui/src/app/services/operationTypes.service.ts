import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OperationType {
  id: string;
  name: string;
  specialization: string;
  requiredStaff: RequiredStaff[];
  phasesDuration: PhasesDuration;
  status: string;
}

export interface RequiredStaff {
  role: string;
  specialization: string;
  quantity: number;
}

export interface PhasesDuration {
  preparation: number;
  surgery: number;
  cleaning: number;
}

@Injectable({
  providedIn: 'root'
})
export class OperationTypeService {
  private apiUrl = 'http://localhost:5500/api/OperationTypes';

  constructor(private http: HttpClient) { }

  getOperationTypes(): Observable<OperationType[]> {
    return this.http.get<OperationType[]>(this.apiUrl);
  }
}