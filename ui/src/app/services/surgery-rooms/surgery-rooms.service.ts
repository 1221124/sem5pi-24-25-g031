import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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
}
