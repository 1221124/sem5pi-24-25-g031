import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {firstValueFrom} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Allergy} from '../../models/allergy.model';

@Injectable({
  providedIn: 'root'
})

export class AllergyService {
  constructor(
    private http: HttpClient
  ) {
  }

  async get(
    accessToken: string
  ) {
    let params = new HttpParams();

    const headers = ({
      'Content-Type': 'application',
      'Authorization': `Bearer ${accessToken}`
    });
    const options = {headers, observe: 'response' as const, params};

    return await firstValueFrom(this.http.get<any[]>(`${environment.allergies}`, options))
      .then(response => {
        console.log(response);

        if (response.status === 200 && response.body) {
          return {
            status: response.status,
            body: response.body.map(allergy => {
              return {
                id: allergy.id,
                code: allergy.code.props.value,
                name: allergy.name.props.value,
                description: allergy.description.props.value
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
    allergy: Allergy
  ) {
    const dto = {
      "code": `${allergy.code}`,
      "name": `${allergy.name}`,
      "description": `${allergy.description}`
    };

    const headers = ({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const};

    return await firstValueFrom(this.http.post<any>(`${environment.allergies}`, dto, options))
      .then(response => {
        if (response.status === 201 && response.body) {
          return {
            status: response.status,
            body: {
              id: response.body.id,
              code: response.body.code.props.value,
              name: response.body.name.props.value,
              description: response.body.description.props.value
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
}
