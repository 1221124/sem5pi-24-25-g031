import {HttpClient} from '@angular/common/http';
import {RoomType} from '../../models/room-type.model';
import {environment, httpOptions} from '../../../environments/environment';
import {firstValueFrom} from 'rxjs';
import {Specialization} from '../../models/specialization.model';
import {Injectable} from '@angular/core';

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
      "SNOMEDCTCode":{
        "Value": specialization.SNOMEDCTCode
      },
      "Name":{
        "Value": specialization.Name
      },
      "Description":{
        "Value": specialization.Description || '-'
      }
    }

    return await firstValueFrom(this.http.post(`${environment.specializations}`, dto, options));
  }
}
