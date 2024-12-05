import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService {

  constructor(private http: HttpClient) { }

  async verifyEmail(token: string) {
    var params = new HttpParams().set('token', token);
    return await firstValueFrom(this.http.get<any>(`${environment.verifyEmailUrl}`, { ...httpOptions, params: params }));
  }

}