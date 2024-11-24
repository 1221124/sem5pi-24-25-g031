import { Injectable } from '@angular/core';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrologService {

  constructor(private http: HttpClient) { }

  async getSurgeryRooms(accessToken: string) {
    const url = environment.surgeryRooms;
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const options = {
      ...httpOptions,
      headers: headers
    };
    try {
      const response = await firstValueFrom(this.http.get<{ roomNumbers: string[] }>(url, options));
      if (response === null || response.body === null) {
        throw new Error('Unexpected response body: ' + response);
      }
      return response.body.roomNumbers;
    } catch (error) {
      throw new Error('Error fetching surgery room numbers: ' + error);
    }
  }

  async runProlog(option: string, surgeryRoom: string, date: string, accessToken: string) {
    const url = `${environment.prolog}`;
    var params = new HttpParams();
    params = params.append('option', option);
    params = params.append('surgeryRoom', surgeryRoom);
    params = params.append('date', date);
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    const options = {
      ...httpOptions,
      headers: headers,
      params: params
    };
    return await firstValueFrom(this.http.get(url, { ...options }));
  }

}
