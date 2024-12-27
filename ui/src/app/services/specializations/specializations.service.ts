import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RoomType} from '../../models/room-type.model';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Specialization} from '../../models/specialization.model';
import {Injectable} from '@angular/core';
import {Staff} from '../../models/staff.model';

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {

  constructor(private http: HttpClient) {}

  async post(specialization: Specialization, accessToken: string) {

    const headers = {
      Authorization: `Bearer ${accessToken}`
    };

    const options = {
      ...httpOptions, headers
    };

    const dto = {
      "name": {
        "value": specialization.Name
      },
      "description": {
        "value": specialization.Description
      }
    }

    return await firstValueFrom(this.http.post(`${environment.specializations}`, dto, options));
  }

  async update(id: string, specialization: Specialization, accessToken: string) {
    console.log("Updating specialization" + id);


    const specializationDto = {
      "name": {
        "value": specialization.Name,
      },
      "description": {
        "value": specialization.Description,
      }
      }

    console.log(specializationDto);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
    const options = { ...httpOptions, headers };
    return await firstValueFrom(this.http.put(`${environment.staffs}/update/${specialization.Id}`, specializationDto, options));
  }
}
