import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { httpOptions, environment } from '../../../environments/environment';
import { PatientMedicalRecord } from '../../models/patient-medical-record.model';
import { MedicalRecordEntry } from '../../models/medical-record-entry';
import { Patient } from '../../models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientMedicalRecordService {

  constructor(private http: HttpClient) { }

  async getPatientMedicalRecord(patient: Patient, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      });

      let params = new HttpParams().set('medicalRecordNumber', patient.MedicalRecordNumber.trim());
      const options = { headers, observe: 'response' as const, params };

      console.log('Getting patient medical record:', patient.MedicalRecordNumber);
      console.log('Options:', options);

      return await firstValueFrom(this.http.get<any>(`${environment.patientMedicalRecord}/medical-record-number`, options))
        .then(response => {
          console.log('Raw API response:', response);

          if (!response || !response.body) {
            throw new Error('API response body is empty or undefined.');
          }

          const patientMedicalRecord: PatientMedicalRecord = {
            Id: response.body.id || '',
            MedicalRecordNumber: response.body.medicalRecordNumber?.props?.value || '',
            Allergies: response.body.allergies?.map((allergy: any) => ({
              ICD11Code: allergy?.props?.code?.props?.value || '',
              Date: new Date(allergy?.props?.date),
              notMeaningfulAnymore: allergy?.props?.notMeaningfulAnyMore || false
            })) || [],
            MedicalConditions: response.body.medicalConditions?.map((condition: any) => ({
              ICD11Code: condition?.props?.code?.props?.value || '',
              Date: new Date(condition?.props?.date),
              notMeaningfulAnymore: condition?.props?.notMeaningfulAnyMore || false
            })) || []
          };

          console.log('Mapped PatientMedicalRecord:', patientMedicalRecord);

          return {
            status: response.status,
            body: {
              patientMedicalRecord
            }
          };
        })
        .catch((error: HttpErrorResponse | Error) => {
          console.error('Error during API request:', error);
          throw error;
        });
    } catch (error) {
      throw new Error('Error getting patient medical record: ' + error);
    }
  }

  async create(patient: Patient, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      console.log('Creating patient medical record:', patient.MedicalRecordNumber);
      const dto = {
        "medicalRecordNumber": patient.MedicalRecordNumber
      };

      const options = { ...httpOptions, headers };

      return await firstValueFrom(this.http.post(`${environment.patientMedicalRecord}`, dto, options));
    } catch (error) {
      throw new Error('Error creating patient medical record: ' + error);
    }
  }
  
  async saveAllergy(id: string, newAllergy: MedicalRecordEntry, accessToken: string) {
    console.log(id);
    console.log(newAllergy);
    console.log(accessToken);
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      const dto = {
        "code": newAllergy.ICD11Code,
        "notMeaningfulAnymore": newAllergy.notMeaningfulAnymore
      };

      const options = { ...httpOptions, headers };

      return await firstValueFrom(this.http.patch(`${environment.patientMedicalRecord}/allergy/${id}`, dto, options))
    } catch (error) {
      throw new Error('Error saving medical condition: ' + error);
    }
  }

  async saveMedicalCondition(id: string, medicalCondition: MedicalRecordEntry, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      const dto = {
        "code": medicalCondition.ICD11Code,
        "notMeaningfulAnymore": medicalCondition.notMeaningfulAnymore
      };

      const options = { ...httpOptions, headers };

      return await firstValueFrom(this.http.patch(`${environment.patientMedicalRecord}/medical-condition/${id}`, dto, options))
    } catch (error) {
      throw new Error('Error saving medical condition: ' + error);
    }
  }

  async deleteMedicalRecord(medicalRecord: PatientMedicalRecord, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      const options = { ...httpOptions, headers };

      return await firstValueFrom(this.http.delete(`${environment.patientMedicalRecord}/${medicalRecord.Id}`, options));
    } catch (error) {
      throw new Error('Error deleting patient medical record: ' + error);
    }
  }

  async downloadPatientMedicalRecord(medicalRecordNumber: string, accessToken: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    });

    const params = new HttpParams().set('medicalRecordNumber', medicalRecordNumber);

    const options = { ...httpOptions, headers, params };

    return await firstValueFrom(this.http.get<any>(`${environment.patientMedicalRecord}/download`, options))
    .then(response => {
      return {
        status: response.status,
        body: {
          file: response.body.file
        }
      };
    });
  }

}