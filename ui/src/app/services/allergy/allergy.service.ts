import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {firstValueFrom} from 'rxjs';
import {environment, httpOptions} from '../../../environments/environment';
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
    accessToken: string,
    filters?: { code?: string; name?: string; description?: string }
  ) {
    let params = new HttpParams();

    if (filters) {
      if (filters.code) params = params.append('code', filters.code);
      if (filters.name) params = params.append('name', filters.name);
      if (filters.description) params = params.append('description', filters.description);
    }

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

  async put (
    accessToken: string,
    allergy: Allergy
  ) {
    const dto = {
      "description": `${allergy.description}`
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const };

    return await firstValueFrom(this.http.put<any>(`${environment.allergies}/${allergy.id}`, dto, options))
      .then(response => {
        if (response.status === 200 && response.body) {
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

  async delete(
    accessToken: string,
    allergy: Allergy
  ) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const };

    return await firstValueFrom(this.http.delete<any>(`${environment.allergies}/${allergy.id}`, options))
      .then(response => {
        if (response.status === 200) {
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

    const response = await firstValueFrom(this.http.get<boolean>(`${environment.allergies}/validateCode`, { ...options, observe: 'response' }));

    const ICD11_REGEX = /^[A-HJ-NP-Z0-9][A-HJ-NP-Z][0-9][A-HJ-NP-Z0-9](\.[A-HJ-NP-Z0-9]{1,2})?$/;

    return response.body ? ICD11_REGEX.test(code) : false;
  }
}
