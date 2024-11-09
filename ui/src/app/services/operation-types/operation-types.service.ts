import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OperationType } from '../../components/operation-types/operation-types.component';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationTypesService {
  message: string = '';

  constructor(
    private http: HttpClient
  ) {}

  post(
    operationType: OperationType
  ){    
    
    const dto = {
      "name": {
        "value": operationType.Name
      },
      "specialization": operationType.Specialization,
      "requiredStaff": operationType.RequiredStaff.map(staff => ({
        "role": staff.Role,
        "specialization": staff.Specialization,
        "quantity": {
          "value": staff.Quantity
        }
      })),
      "phasesDuration": {
        "phases": {
          "Preparation": {
            "value": operationType.PhasesDuration.Preparation
          },
          "Surgery": {
            "value": operationType.PhasesDuration.Surgery
          },
          "Cleaning": {
            "value": operationType.PhasesDuration.Cleaning
          }
        }
      }
    };

  return firstValueFrom(this.http.post(environment.operationTypes, dto, httpOptions));
  }
}
