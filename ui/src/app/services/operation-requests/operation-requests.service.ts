import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment } from '../../../environments/environment';

import {firstValueFrom, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OperationRequestsService {
  message: string = '';

  constructor(
    private http: HttpClient
  ) {
  }

  async post(
    accessToken: string,
    staffDto: string,
    patientDto: any,
    operationTypeDto: string,
    deadlineDateDto: string,
    priorityDto: string
  ) {

    try {
      const deadlineDate = new Date(deadlineDateDto);
      console.log('Deadline Date:', deadlineDate);
    } catch (error) {
      console.error('Error parsing date:', error);
    }

    const dto = { //creatingOperationRequestDto
      "staff": staffDto,
      "patient": {
        "value": patientDto
      },
      "operationType": {
        "value": operationTypeDto
      },
      "deadlineDate": deadlineDateDto,
      "priority": priorityDto
    };

    console.log('Operation Request DTO:', dto);

    let params = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, params};

    return await firstValueFrom(this.http.post(environment.operationRequests, dto, options))
      .then(response => {
        console.log(response);

        if (response.status === 200 || response.status === 201) {
          return {
            status: response.status,
            body: response.body
          };
        } else {
          return {
            status: response.status,
            body: []
          };
        }
      }).catch(error => {
        console.log('Operation Request:', dto);
        console.error('Error creating Operation Request:', error);
        return {
          status: error.status,
          body: []
        };
      });
  }

  async delete(accessToken: string, id: string) {
    const deleteUrl = environment.operationRequests + '/' + id;
    console.log('ID:', id);
    console.log('Delete URL:', deleteUrl);

    let params = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, params};

    return await firstValueFrom(this.http.delete(deleteUrl, options))
      .then(
        response => {
          console.log(response);

          if (response.status == 200) {
            return {
              status: response.status,
              body: response.body
            };
          } else {
            return {
              status: response.status,
              body: []
            };
          }
        }
      ).catch(
        error => {
          console.error('Error deleting Operation Request:', error);
          return {
            status: error.status,
            body: []
          }
        });

    // return this.http.delete(deleteUrl, httpOptions)
    //   .subscribe(
    //     response => {
    //       console.log('Operation Request deleted successfully', response);
    //     },
    //     error => {
    //       console.error('Error deleting request:', error);
    //     }
    //   );
  }

  async put(
    accessToken: string,
    idDto: string,
    deadlineDateDto: string,
    priorityDto: string,
    statusDto: string
  ) {

    console.log('ID:', idDto);

    try {
      const deadlineDate = new Date(deadlineDateDto);
      console.log('Deadline Date:', deadlineDate);
    } catch (error) {
      console.error('Error parsing date:', error);
    }

    const dto = { //updatingOperationRequestDto
      "id": idDto,
      "deadlineDate": {
        "date": deadlineDateDto
      },
      "priority": priorityDto,
      "requestStatus": statusDto
    };

    console.log('Operation Request DTO:', dto);

    let httpParams = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, httpParams};

    return await firstValueFrom(this.http.put(environment.operationRequests, dto, options))
      .then(response => {
        console.log(response);

        if (response.status === 200) {
          return {
            status: response.status,
            body: response.body
          };
        } else {
          return {
            status: response.status,
            body: []
          };
        }
      }).catch(error => {
        console.error('Error updating Operation Request:', error);
        return {
          status: error.status,
          body: []
        };
      });
  }

  async getAll(accessToken: string) {
    let params = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, params};

    return await firstValueFrom(this.http.get<any[]>(`${environment.operationRequests}`, options))
      .then(response => {
        console.log(response);

        if (response.status === 200 && response.body) {
          return {
            status: response.status,
            body: response.body.map(request => {
              return {
                  id: request.id,
                  staff: request.staff.value,
                  patient: request.patient.value,
                  operationType: request.operationType.value,
                  deadlineDate: request.deadlineDate.date,
                  priority: request.priority,
                  status: request.status,
                  requestCode: request.requestCode
              };
            })
          };
        } else {
          return {
            status: response.status,
            body: []
          };
        }
      });
  }

  async get(
    accessToken: string,
    searchIdDto: string,
    searchLicenseNumber: string,
    searchPatientName: string,
    searchOperationType: string,
    searchDeadlineDate: string,
    searchPriority: string,
    searchRequestStatus: string
  ) {

    let searchUrl = environment.operationRequests + '/filtered?';
    const params = [];

    if (searchIdDto) {
      console.log('ID:', searchIdDto);
      params.push('searchId=' + encodeURIComponent(searchIdDto));
    }

    if (searchLicenseNumber) {
      console.log('License Number: ', searchLicenseNumber);
      params.push('searchLicenseNumber=' + encodeURIComponent(searchLicenseNumber))
    }

    if (searchPatientName) {
      console.log('Patient Name:', searchPatientName);
      const nameParts = searchPatientName.trim().split(' ');

      if (nameParts.length === 2) {
        const name = nameParts[0] + '-' + nameParts[1];

        console.log('Name:', name);

        params.push('searchPatientName=' + encodeURIComponent(name));
      }
    }

    if (searchOperationType) {
      console.log('Operation Type:', searchOperationType);
      params.push('searchOperationType=' + encodeURIComponent(searchOperationType));
    }

    if (searchDeadlineDate) {
      console.log("date: " + searchDeadlineDate);
      params.push('searchDeadlineDate=' + encodeURIComponent(searchDeadlineDate));
    }


    if (searchPriority) {
      console.log('Priority:', searchPriority);
      params.push('searchPriority=' + encodeURIComponent(searchPriority));
    }

    if (searchRequestStatus) {
      console.log('Request Status:', searchRequestStatus);
      params.push('searchRequestStatus=' + encodeURIComponent(searchRequestStatus));
    }

    // Join all parameters with '&'
    searchUrl += params.join('&');

    console.log('Search URL:\n', searchUrl);

    let httpParams = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, httpParams};

    return await firstValueFrom(this.http.get<any[]>(searchUrl, options))
      .then(response => {
        console.log(response);

        if (response.status === 200 || response.status === 201) {
          if (response.body) {
            return {
              status: response.status,
              body: response.body.map(request => {
                return {
                  id: request.id,
                  staff: request.staff.value,
                  patient: request.patient.value,
                  operationType: request.operationType.value,
                  deadlineDate: request.deadlineDate.date,
                  priority: request.priority,
                  status: request.status,
                  requestCode: request.requestCode
                };
              })
            }
          } else {
            return {
              status: response.status,
              body: []
            };
          }
        } else {
          return {
            status: response.status,
            body: []
          }
        }
      }).catch(error => {
        console.error('Error fetching Operation Request:', error);
        return {
          status: error.status,
          body: []
        };
      });
  }

  async getRequestStatus(accessToken: string) {
    let params = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, params};

    return await firstValueFrom(this.http.get<string[]>(environment.enums + "/requestStatuses", options))
      .then(response => {
        console.log(response);

        if (response.status === 200 && response.body) {
          return {
            status: response.status,
            body: response.body.map(status => {
              return {
                value: status
              }
            })
          }

        } else {
          return {
            status: response.status,
            body: []
          }
        }

      }).catch(error => {
        console.error('Error fetching Request Status:', error);
        return {
          status: error.status,
          body: []
        }
      });
  }

  async getPriority(accessToken: string) {
    let params = new HttpParams();

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    });

    const options = {headers, observe: 'response' as const, params};

    return firstValueFrom(this.http.get<string[]>(environment.enums + "/priorities", options))
      .then(response => {
        console.log(response);

        if (response.status === 200 && response.body) {
          return {
            status: response.status,
            body: response.body
          };
        } else {
          return {
            status: response.status,
            body: []
          }
        }
      }).catch(error => {
        console.error('Error fetching Priorities:', error);
        return {
          status: error.status,
          body: []
        }
      });
  }
}
