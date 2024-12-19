import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {firstValueFrom, throwError} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  constructor(
    private http: HttpClient
  ) { }

  async getMedicalConditions(
      /*pageFilter: any,*/
      accessToken: string
    ) {
      let params = new HttpParams();
        // .set('pageNumber', pageFilter.pageNumber.toString());
  
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });
  
      const options = {headers, observe: 'response' as const, params};
  
      return await firstValueFrom(this.http.get<any[]>(`${environment.medicalConditions}`, options))
        .then(response => {
          console.log(response);
  
          if (response.status === 200 && response.body) {
            return {
              status: response.status,
              body: response.body.map(medicalCondition => {
                return {
                    id: medicalCondition.id,
                    code: medicalCondition.code.props.value,
                    name: medicalCondition.name.props.value,
                    description: medicalCondition.description.props.value,
                    commonSymptoms: medicalCondition.commonSymptoms.props
                };
              })
            };
          } else {
            return {
              status: response.status,
              body: []
            };
          }
        });
    }
}
