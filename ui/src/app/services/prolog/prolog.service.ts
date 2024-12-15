import { Injectable } from '@angular/core';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrologService {

  constructor(private http: HttpClient) { }

  async runProlog(option: string, surgeryRoomNumber: string, date: string, accessToken: string) {
    const url = `${environment.prolog}`;
    const dateTime = new Date(date).toISOString();
    const prologParams = {
      "SurgeryRoomNumber": surgeryRoomNumber,
      "DateTime": dateTime,
      "Option": option
    };
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };
    return await firstValueFrom(this.http.post(url, prologParams, { ...httpOptions, headers }));
  }

}
