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

  //createStaff(creatingStaffDto: any): Observable<any> {
  createStaff(
    firstNameDto: string,
    lastNameDto: string,
    phoneNumberDto: string,
    emailDto: string,
    specializationDto: string,
    roleDto: string
  ){

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
  
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    
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
        response =>{ 
          console.log('Staff submitted successfully:', response);
        },
        error => {
          console.log('Staff:', staffDto);
          console.error('Error submitting staff:', error)
        }
      );;
  }
}
