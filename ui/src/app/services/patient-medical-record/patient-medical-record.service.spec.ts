import { TestBed } from '@angular/core/testing';
import { PatientMedicalRecordService } from './patient-medical-record.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Patient } from '../../models/patient.model';
import { MedicalRecordEntry } from '../../models/medical-record-entry';
import { of } from 'rxjs';

describe('PatientMedicalRecordService', () => {
  let service: PatientMedicalRecordService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  const mockPatient: Patient = {
    Id: '1',
    FullName: { FirstName: 'John', LastName: 'Doe' },
    DateOfBirth: new Date('1990-01-01'),
    Gender: 'M',
    MedicalRecordNumber: '12345',
    ContactInformation: { Email: 'email@email.com', PhoneNumber: 1234567890 },
    EmergencyContact: 1234567891,
    UserId: '1'
  };

  const mockAccessToken = 'valid-token';

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'patch', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        PatientMedicalRecordService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(PatientMedicalRecordService);
  });

  describe('getPatientMedicalRecord', () => {
    it('should get the patient medical record successfully', async () => {
      const mockResponse = {
        body: {
          id: '1',
          medicalRecordNumber: {
            props: {
              value: '12345'
            }
          },
          allergies: [
            {
              props: {
                code: {
                  props: {
                    value: 'A123'
                  }
                },
                date: '2024-12-29'
              }
            }
          ],
          medicalConditions: [
            {
              props: {
                code: {
                  props: {
                    value: 'B456'
                  }
                },
                date: '2024-12-28'
              }
            }
          ]
        },
        status: 200
      };

      httpClientSpy.get.and.returnValue(of(mockResponse));

      const response = await service.getPatientMedicalRecord(mockPatient, mockAccessToken);

      expect(response.status).toBe(200);
      expect(response.body.patientMedicalRecord.MedicalRecordNumber).toBe('12345');
      expect(response.body.patientMedicalRecord.Allergies.length).toBe(1);
      expect(response.body.patientMedicalRecord.MedicalConditions.length).toBe(1);
    });

    it('should throw an error if response body is empty', async () => {
      const mockResponse = {
        body: undefined,
        status: 200
      };

      httpClientSpy.get.and.returnValue(of(mockResponse));

      try {
        await service.getPatientMedicalRecord(mockPatient, mockAccessToken);
        fail('Expected error, but got response');
      } catch (error) {
        expect(error).toEqual(new Error('API response body is empty or undefined.'));
      }
    });
  });

  describe('create', () => {
    it('should create a new patient medical record successfully', async () => {
      const mockResponse = { status: 201, body: { id: '1' } };

      const newPatient: Patient = {
        Id: '1',
        FullName: { FirstName: 'John', LastName: 'Doe' },
        DateOfBirth: new Date('1990-01-01'),
        Gender: 'M',
        MedicalRecordNumber: '12345',
        ContactInformation: { Email: 'newemail@email.com', PhoneNumber: 1234567892 },
        EmergencyContact: 1234567893,
        UserId: '1'
      };

      httpClientSpy.post.and.returnValue(of(mockResponse));

      const response = await service.create(newPatient, mockAccessToken);

      expect(response.status).toBe(201);
    });

    it('should throw an error if creation fails', async () => {
      const mockErrorResponse: HttpErrorResponse = {
        name: 'HttpErrorResponse',
        message: 'Http failure response for (unknown url): 500 Internal Server Error',
        ok: false,
        type: 2,
        error: 'Creation failed',
        status: 500,
        statusText: 'Internal Server Error',
        headers: new HttpHeaders(),
        url: ''
      };

      httpClientSpy.post.and.returnValue(of(mockErrorResponse));

      try {
        await service.create(mockPatient, mockAccessToken);
        fail('Expected error, but got success');
      } catch (error) {
        expect(error).toEqual(new Error('Error creating patient medical record: ' + mockErrorResponse));
      }
    });
  });

  describe('saveMedicalCondition', () => {
    it('should save a medical condition successfully', async () => {
      const medicalCondition: MedicalRecordEntry = {
        ICD11Code: 'A123',
        Date: new Date('2024-12-29'),
        notMeaningfulAnymore: false
      };

      const mockResponse = { status: 200 };

      httpClientSpy.patch.and.returnValue(of(mockResponse));

      const response = await service.saveMedicalCondition('1', medicalCondition, mockAccessToken);

      expect(response.status).toBe(200);
    });

    it('should throw an error if saving the medical condition fails', async () => {
      const medicalCondition: MedicalRecordEntry = {
        ICD11Code: 'A123',
        Date: new Date('2024-12-29'),
        notMeaningfulAnymore: false
      };

      const mockErrorResponse: HttpErrorResponse = {
        name: 'HttpErrorResponse',
        message: 'Http failure response for (unknown url): 500 Internal Server Error',
        ok: false,
        type: 2,
        error: 'Save failed',
        status: 500,
        statusText: 'Internal Server Error',
        headers: new HttpHeaders(),
        url: ''
      };

      httpClientSpy.patch.and.returnValue(of(mockErrorResponse));

      try {
        await service.saveMedicalCondition('1', medicalCondition, mockAccessToken);
        fail('Expected error, but got success');
      } catch (error) {
        expect(error).toEqual(new Error('Error saving medical condition: ' + mockErrorResponse));
      }
    });
  });

  describe('deleteMedicalRecord', () => {
    it('should delete a patient medical record successfully', async () => {
      const mockResponse = { status: 200 };

      const mockMedicalRecord = { Id: '1', MedicalRecordNumber: '12345', Allergies: [], MedicalConditions: [] };

      httpClientSpy.delete.and.returnValue(of(mockResponse));

      const response = await service.deleteMedicalRecord(mockMedicalRecord, mockAccessToken);

      expect(response.status).toBe(200);
    });

    it('should throw an error if deleting the medical record fails', async () => {
      const mockErrorResponse: HttpErrorResponse = {
        name: 'HttpErrorResponse',
        message: 'Http failure response for (unknown url): 500 Internal Server Error',
        ok: false,
        type: 2,
        error: 'Delete failed',
        status: 500,
        statusText: 'Internal Server Error',
        headers: new HttpHeaders(),
        url: ''
      };

      const mockMedicalRecord = { Id: '1', MedicalRecordNumber: '12345', Allergies: [], MedicalConditions: [] };

      httpClientSpy.delete.and.returnValue(of(mockErrorResponse));

      try {
        await service.deleteMedicalRecord(mockMedicalRecord, mockAccessToken);
        fail('Expected error, but got success');
      } catch (error) {
        expect(error).toEqual(new Error('Error deleting patient medical record: ' + mockErrorResponse));
      }
    });
  });
});