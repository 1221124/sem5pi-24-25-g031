import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StaffsService {

  private apiUrl = environment.staffs;

  constructor(private http: HttpClient) { }

  createStaff(creatingStaffDto: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.apiUrl, creatingStaffDto, httpOptions);
  }
}
