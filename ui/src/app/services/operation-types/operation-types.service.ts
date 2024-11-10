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

  post(operationType: OperationType) {    
    
    const dto = {
      "Name": {
        "Value": operationType.Name
      },
      "Specialization": operationType.Specialization,
      "RequiredStaff": operationType.RequiredStaff.map(staff => ({
        "Role": staff.Role,
        "Specialization": staff.Specialization,
        "Quantity": {
          "Value": staff.Quantity
        }
      })),
      "PhasesDuration": {
        "Phases": {
          "Preparation": {
            "Quantity": {
              "Value": operationType.PhasesDuration.Preparation
            }
          },
          "Surgery": {
            "Quantity": {
              "Value": operationType.PhasesDuration.Surgery
            }
          },
          "Cleaning": {
            "Quantity": {
              "Value": operationType.PhasesDuration.Cleaning
            }
          }
        }
      }
    };

    const options = { ...httpOptions, observe: 'response' as const };
    return firstValueFrom(this.http.post(environment.operationTypes, dto, options));
  }
}
