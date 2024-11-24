import { TestBed } from '@angular/core/testing';
import { PatientService } from './patient.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import { of } from 'rxjs';
import {environment} from '../../../environments/environment';

describe('PatientService', () => {
  let service: PatientService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(PatientService);
  });

  it('should retrieve a patient by email', async () => {
    const mockPatient = {
      id: '6ae7402e-0773-4a3a-ad19-dd52304549d0',
      fullName: {
        firstName: "Guilherme",
        lastName: "Silva"
      },
      dateOfBirth: "1990-01-01",
      gender: "MALE",
      medicalRecordNumber: "202411000001",
      contactInformation: {
        email: "teste@gmail.com",
        phoneNumber: 123456789
      },
      medicalConditions: ["Hypertension"],
      emergencyContact: 987654321,
      appointmentHistory:[{
        start: "2021-10-10T08:00:00",
        end: "2021-10-10T09:00:00"
      }],
      userId: "123456"
    }

    httpClientSpy.get.and.returnValue(
      of(new HttpResponse({ status: 200, body: { patient: mockPatient } }))
    );

    const email = 'teste@gmail.com';
    await service.getByEmail(email, '').then(response => {
      expect(response.status).toBe(200);
    });

    const calledUrl = httpClientSpy.get.calls.mostRecent().args[0];
    expect(calledUrl).toBe(`${environment.patients}/email`);
    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should delete a patient by ID', async () => {
    const mockId = '6ae7402e-0773-4a3a-ad19-dd52304549d0';
    const mockToken = 'mockAccessToken';

    httpClientSpy.delete.and.returnValue(of({}));

    await service.deletePatient(mockId, mockToken);

    const calledUrl = httpClientSpy.delete.calls.mostRecent().args[0];

    expect(calledUrl).toBe(`${environment.patients}/patient/${mockId}`);
    expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
  });

  it('should throw an error for invalid ID format', async () => {
    const invalidId = 'invalid-guid';
    const mockToken = 'mockAccessToken';

    try {
      await service.deletePatient(invalidId, mockToken);
      fail('The method should have thrown an error for an invalid ID format');
    } catch (error: any) {
      expect(error.message).toBe('Invalid ID format. Please provide a valid GUID.');
    }

    expect(httpClientSpy.delete).not.toHaveBeenCalled();
  });

  it('should update a patient', async () => {
    const mockPatient = {
      Id: 'string',
      FullName: {
        FirstName: 'string',
        LastName: 'string'
      },
      DateOfBirth: new Date("1990-01-01"),
      Gender: 'string',
      MedicalRecordNumber: 'string',
      ContactInformation: {
        Email: 'teste@gmail.com',
        PhoneNumber: 913455474
      },
      MedicalCondition: ["Hypertension"],
      EmergencyContact: 913455493,
      AppointmentHistory: [{
        Start: new Date("2021-10-10T08:00:00"),
        End: new Date("2021-10-10T09:00:00")
      }],
      UserId: 'string'
    };

    const oldEmail = 'old.email@example.com';
    const mockToken = 'mockAccessToken';

    const mockResponse = {
      patient: { ...mockPatient }
    };

    httpClientSpy.put.and.returnValue(of(mockResponse));

    const response = await service.update(mockPatient, oldEmail, mockToken);

    const calledUrl = httpClientSpy.put.calls.mostRecent().args[0];
    const calledBody = httpClientSpy.put.calls.mostRecent().args[1];

    expect(calledUrl).toBe(service.apiUrl);

    expect(calledBody).toEqual({
      emailId: { Value: oldEmail },
      email: { value: mockPatient.ContactInformation.Email },
      phoneNumber: { value: mockPatient.ContactInformation.PhoneNumber }
    });

    expect(httpClientSpy.put).toHaveBeenCalledTimes(1);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
