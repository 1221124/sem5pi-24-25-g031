import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoomType } from '../../models/room-type.model';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomTypesService {

  constructor(private http: HttpClient) {}

  async post(roomType: RoomType, accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const options = {
      ...httpOptions, headers
    };

    const dto = {
      "Name":{
        "Value": roomType.Name
      },
      "Description":{
        "Value": roomType.Description || '-'
      },
      "AvailableForSurgeries": roomType.AvailableForSurgeries
    }

    return await firstValueFrom(this.http.post(`${environment.roomTypes}`, dto, options));
  }

  async get(accessToken: string) {
    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const options = {
      ...httpOptions, headers
    };

    return await firstValueFrom(this.http.get<{ roomTypes: any[], totalItems: number }>(`${environment.roomTypes}`, options))
    .then(response => {
      if (response.status === 200 && response.body) {
        const roomTypes = response.body.roomTypes.map(item => ({
          Id: item.id,
          RoomTypeCode: item.roomTypeCode.value,
          Name: item.name.value,
          Description: item.description.value,
          AvailableForSurgeries: item.availableForSurgeries as boolean
        }));

        return {
          status: response.status,
          body: {
            roomTypes,
            totalItems: response.body.totalItems
          }
        };
      } else {
        throw new Error('Unexpected response structure or status');
      }
    });
  }
}