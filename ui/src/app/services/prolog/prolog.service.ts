import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrologService {

  private apiUrl = environment.prolog;

  constructor(private http: HttpClient) { }

  async getSurgeryRooms() {
    const url = `${environment.enums}/surgeryRooms`;
    return await firstValueFrom(this.http.get<string[]>(url));
  }
}
