import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { httpOptions, environment } from '../../../environments/environment';
import { PatientMedicalRecord } from '../../models/patient-medical-record.model';
import { MedicalRecordEntry } from '../../models/medical-record-entry';

@Injectable({
  providedIn: 'root'
})
export class PatientMedicalRecordService {

  constructor(private http: HttpClient) { }

  async getPatientMedicalRecord(medicalRecordNumber: string, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      const params = new HttpParams().set('medicalRecordNumber', medicalRecordNumber);

      const options = { ...httpOptions, params, headers };
      
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

  async saveMedicalCondition(id: string, medicalCondition: MedicalRecordEntry, accessToken: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${accessToken}`
      });

      const dto = {
        "ICD11Code": medicalCondition.ICD11Code,
        "notMeaningfulAnymore": medicalCondition.notMeaningfulAnymore
      };

      const options = { ...httpOptions, headers };

      return await firstValueFrom(this.http.patch(`${environment.patientMedicalRecord}/medical-condition/${id}`, dto, options))
    } catch (error) {
      throw new Error('Error saving medical condition: ' + error);
    }
  }

}
