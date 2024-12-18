import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { SurgeryRoom } from '../../models/surgery-room.model';

@Injectable({
  providedIn: 'root'
})
export class SurgeryRoomsService {

  constructor(private http: HttpClient) { }

  async get(accessToken: string) {
    const headers = { Authorization: `Bearer ${accessToken}` };
    const options = { ...httpOptions, headers };
    return await firstValueFrom(this.http.get<{ surgeryRooms: any[], totalItems: number }>(`${environment.surgeryRooms}`, options))
    .then(response => {
      if (response.status === 200 && response.body) {
        const surgeryRooms = response.body.surgeryRooms.map(item => ({
          Id: item.id,
          SurgeryRoomNumber: item.surgeryRoomNumber,
          RoomTypeCode: item.roomTypeCode.value,
          RoomCapacity: item.roomCapacity.capacity,
          AssignedEquipment: item.assignedEquipment.equipment,
          CurrentStatus: item.currentStatus,
          MaintenanceSlots: item.maintenanceSlots.map((slot: { start: any; end: any; }) => ({
            Start: slot.start,
            End: slot.end
          }))
        }));

        return {
          status: response.status,
          body: {
            surgeryRooms,
            totalItems: response.body.totalItems
          }
        };
      } else {
        throw new Error('Unexpected response structure or status');
      }
    });
  }

  async getAvailable(start: string, end: string, accessToken: string) {
    const headers = { Authorization: `Bearer ${accessToken}` };

    console.log('start', start);
    console.log('end', end);

    const params = new HttpParams().set('start', start).set('end', end);

    const options = { ...httpOptions, headers, params };

    //show full url with query
    console.log(`${environment.surgeryRooms}/available?${params.toString()}`);
    return await firstValueFrom(this.http.get<{ surgeryRooms: any[], totalItems: number }>(`${environment.surgeryRooms}/available`, options))
    .then(response => {
      if (response.status === 200 && response.body) {
        const surgeryRooms : SurgeryRoom[] = response.body.surgeryRooms.map(item => ({
          Id: item.id,
          SurgeryRoomNumber: item.surgeryRoomNumber,
          RoomTypeCode: item.roomTypeCode.value,
          RoomCapacity: item.roomCapacity.capacity,
          AssignedEquipment: item.assignedEquipment.equipment,
          CurrentStatus: item.currentStatus,
          MaintenanceSlots: item.maintenanceSlots.map((slot: { start: any; end: any; }) => ({
            Start: slot.start,
            End: slot.end
          }))
        }));

        return {
          status: response.status,
          body: {
            surgeryRooms,
            totalItems: response.body.totalItems
          }
        };
      } else {
        throw new Error('Unexpected response structure or status');
      }
    });
  }
}
