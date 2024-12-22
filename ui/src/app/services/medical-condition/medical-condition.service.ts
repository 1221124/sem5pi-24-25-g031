import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {firstValueFrom} from 'rxjs';
import { environment, httpOptions } from '../../../environments/environment';
import { MedicalCondition } from '../../models/medical-condition.model';

@Injectable({
  providedIn: 'root'
})
export class MedicalConditionService {
  constructor(
    private http: HttpClient
  ) { }

  async get(
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
                    commonSymptoms: medicalCondition.commonSymptoms.map((symptom: { props: { value: any; }; }) => symptom.props.value)
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

  async post(
      accessToken: string,
      medicalCondition: MedicalCondition
    ) {
      // const dto = {
      //   "code": `${medicalCondition.code}`,
      //   "name": `${medicalCondition.name}`,
      //   "description": `${medicalCondition.description}`,
      //   "commonSymptoms": `${medicalCondition.commonSymptoms}`
      // };

      const dto = {
        "code": "AB02",
        "name": "name",
        "description": "description",
        "commonSymptoms": ["symptom1", "symptom2"]
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });

      const options = {headers, observe: 'response' as const};

      console.log('DTO:', dto);

      return await firstValueFrom(this.http.post<any>(environment.medicalConditions, dto, options))
        .then(response => { 
          console.log("response: ", response);

          if (response.status === 201 && response.body) {
            return {
              status: response.status,
              body: {
                id: response.body.id,
                code: response.body.code.props.value,
                name: response.body.name.props.value,
                description: response.body.description.props.value,
                commonSymptoms: medicalCondition.commonSymptoms
              }
            };
          } else {
            return {
              status: response.status,
              body: null
            };
          }
        });

      }

    async put(
      accessToken: string,
      medicalCondition: MedicalCondition
    ) {
      const dto = {
        "description": `${medicalCondition.description}`,
        "commonSymptoms": `${medicalCondition.commonSymptoms}`.split(',')
    };

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });

      const options = {headers, observe: 'response' as const};

      console.log('DTO:', dto);

      return await firstValueFrom(this.http.put<any>(`${environment.medicalConditions}/${medicalCondition.id}`, dto, options))
        .then(response => {
          console.log(response);

          if (response.status === 200 && response.body) {
            return {
              status: response.status,
              body: {
                id: response.body.id,
                code: response.body.code.props.value,
                name: response.body.name.props.value,
                description: response.body.description.props.value,
                commonSymptoms: medicalCondition.commonSymptoms
              }
            };
          } else {
            return {
              status: response.status,
              body: null
            };
          }
        });
    }


  async delete(
    accessToken: string,
    medicalCondition: MedicalCondition
  ){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const };

    return await firstValueFrom(this.http.delete<any>(`${environment.medicalConditions}/${medicalCondition.id}`, options))
      .then(response => {
        console.log("Response: ", response);

        if (response.status === 204) {
          return {
            status: response.status,
            body: null
          };
        } else {
          return {
            status: response.status,
            body: null
          };
        }
      });

  }

  async validateICD11Code(code: string, accessToken: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    const params = new HttpParams().set('code', code);
    const options = { ...httpOptions, headers, params };

    const response = await firstValueFrom(this.http.get<boolean>(`${environment.medicalConditions}/validateCode`, { ...options, observe: 'response' }));

    const ICD11_REGEX = /^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9](\.[A-HJ-NP-Z0-9]{1,2})?$/;

    return response.body ? ICD11_REGEX.test(code) : false;
  }
}
