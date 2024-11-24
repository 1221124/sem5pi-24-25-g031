import { Injectable } from '@angular/core';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrologService {

  constructor(private http: HttpClient) { }

  async getSurgeryRooms() {
    const url = environment.surgeryRooms;
    try {
      const response = await firstValueFrom(this.http.get<{ roomNumbers: string[] }>(url, httpOptions));
      if (response === null || response.body === null) {
        throw new Error('Unexpected response body: ' + response);
      }
      return response.body.roomNumbers;
    } catch (error) {
      throw new Error('Error fetching surgery room numbers: ' + error);
    }
  }

  async runProlog(surgeryRoom: string, date: string) {
    const url = `${environment.prolog}`;
    var params = new HttpParams();
    params = params.append('surgeryRoom', surgeryRoom);
    params = params.append('date', date);
    return await firstValueFrom(this.http.get(url, { ...httpOptions, params }));
  }

}