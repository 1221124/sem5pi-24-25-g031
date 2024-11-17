import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment, httpOptions } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffsService {

  private apiUrl = environment.staffs;

  currentPage = 1;
  itemsPerPage = 5;
  totalItems = this.getStaff.length;

  constructor(private http: HttpClient) { }

  //createStaff(creatingStaffDto: any): Observable<any> {
  createStaff(
    firstNameDto: string,
    lastNameDto: string,
    phoneNumberDto: string,
    emailDto: string,
    specializationDto: string,
    roleDto: string
  ) {

    //   fetch(environment.staffs, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       firstname: firstNameDto,
    //       lastName: lastNameDto,
    //       phoneNumber: phoneNumberDto,
    //       email: emailDto,
    //       specialization: specializationDto,
    //       role: roleDto,

    //     }),
    //   })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Network response was not ok');
    //     }
    //     return response.json();
    //   })
    //   .then(data => console.log(data))
    //   .catch(error => {
    //     console.error('Error:', error);
    //     console.error('Response status:', error?.status);
    //     console.error('Response text:', error?.message);
    //   });
    // };

    const staffDto = {
      "fullName": {
        "firstName": {
          "value": firstNameDto
        },
        "lastName": {
          "value": lastNameDto
        }
      },
      "phoneNumber": {
        "value": phoneNumberDto
      },
      "email": {
        "value": emailDto
      },  // wrapping email in an object with a 'value' field
      "specialization": specializationDto,  // wrapping specialization in an object with a 'value' field
      "roleFirstChar": {
        "value": roleDto
      }  // wrapping role in an object with a 'value' field
    };

    // const body = JSON.stringify(creatingStaffDto);

    // {
    //   "fullName": {
    //     "firstName": {
    //       "value": "string"
    //     },
    //     "lastName": {
    //       "value": "string"
    //     }
    //   },
    //   "phoneNumber": {
    //     "value": 0
    //   },
    //   "email": {
    //     "value": "string"
    //   },
    //   "specialization": 0,
    //   "roleFirstChar": {
    //     "value": "string"
    //   }
    // }


    // this.http.post(this.apiUrl, staffDto, httpOptions).subscribe(
    //   response =>{ 
    //     console.log('Staff submitted successfully:', response);
    //   },
    //   error => {
    //     console.error('Error submitting staff:', error)
    //   }
    // );;

    return this.http.post(this.apiUrl, staffDto, httpOptions)
      .subscribe(
        response => {
          console.log('Staff submitted successfully:', response);
        },
        error => {
          console.log('Staff:', staffDto);
          console.error('Error submitting staff:', error)
        }
      );;
  }

  async getSpecializations() {
    const url = `${environment.enums}/specializations`;
    return await firstValueFrom(this.http.get<string[]>(url));
  }

  async getStaff(filter: any, accessToken: string) {
    let params = new HttpParams();

    if (filter.pageNumber > 0) {
      params = params.set('pageNumber', filter.pageNumber.toString());
      if (filter.name !== '') params = params.set('name', filter.name);
      if (filter.email !== '') params = params.set('email', filter.email);
      if (filter.specialization !== '') params = params.set('specialization', filter.specialization);

    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = { headers, observe: 'response' as const, params };

    return await firstValueFrom(this.http.get<{ staffs: any[], totalItems: number }>(`${environment.staffs}`, options))
      .then(response => {
        if (response.status === 200 && response.body) {

          // Log para verificar a resposta
          console.log('Resposta da API:', response.body);

          // Mapeia os dados dos funcionários
          const mappedStaffs = response.body.staffs.map(item => ({
            FullName: {
              FirstName: item.fullName.firstName.value,
              LastName: item.fullName.lastName.value
            },
            licenseNumber: item.licenseNumber.toString(),
            specialization: item.specialization.toString(),
            ContactInformation: {
              Email: item.contactInformation.email.value,
              PhoneNumber: item.contactInformation.phoneNumber.value
            },
            status: item.status.toString(),
            SlotAppointement: item.slotAppointment.map((appointment: { start: string, end: string }) => ({
              Start: appointment.start,
              End: appointment.end
            })),
            SlotAvailability: item.slotAvailability.map((availability: { start: string, end: string }) => ({
              Start: availability.start,
              End: availability.end
            }))
          }));

          return {
            status: response.status,
            body: {
              staffs: mappedStaffs,
              totalItems: response.body.totalItems
            }
          };
        } else {
          throw new Error('Estrutura de resposta inesperada ou status diferente de 200');
        }
      });
  }


  editStaff(staffEmail: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${staffEmail}`, httpOptions);
  }

  deleteStaff(staffEmail: any): Observable<any> {
    console.log('Deleting staff 2:', staffEmail);
    return this.http.delete(`${this.apiUrl}/${staffEmail}`, httpOptions);
  }


}

