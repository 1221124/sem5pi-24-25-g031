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
    return await firstValueFrom(this.http.get<{rooms: any[]}>(url, httpOptions))
    .then(response => {
      if (response.status === 200 && response.body) {
        const rooms = response.body.rooms.map(room => ({
          SurgeryRoomNumber: room.SurgeryRoomNumber
        }));

        return {
          status: response.status,
          body: {
            rooms
          }
        };
      } else {
        throw new Error('Unexpected response structure or status: ' + response.status);
      }
    });
  }

  async runProlog(surgeryRoom: string, date: string) {
    const url = `${environment.prolog}`;
    var params = new HttpParams();
    params = params.append('surgeryRoom', surgeryRoom);
    params = params.append('date', date);
    return await firstValueFrom(this.http.get(url, { ...httpOptions, params }));
  }

}