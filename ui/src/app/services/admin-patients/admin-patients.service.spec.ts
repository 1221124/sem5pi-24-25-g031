import { TestBed } from '@angular/core/testing';

import { PatientsService } from './admin-patients.service';
import * as zlib from 'node:zlib';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environment} from '../../../environments/environment';
import {Observable, of} from 'rxjs';

describe('PatientsService', () => {
  let service: PatientsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post',  'get', 'put', 'delete']);

    TestBed.configureTestingModule({
      providers: [
        PatientsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(PatientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create a new patient', () => {
    const mockPatient = {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      gender: 'Male'
    };

    const mockResponse = { success: true };

    httpClientSpy.post.and.returnValue(of(mockResponse));


    service.post(
      mockPatient.firstName,
      mockPatient.lastName,
      mockPatient.dateOfBirth,
      mockPatient.email,
      mockPatient.phoneNumber,
      mockPatient.gender,
      ''
    );


    expect(httpClientSpy.post).toHaveBeenCalledWith(
      environment.patients,
      {
        fullName: {
          firstName: { value: 'John' },
          lastName: { value: 'Doe' }
        },
        dateOfBirth: { birthDate: mockPatient.dateOfBirth },
        contactInformation: {
          email: { value: 'john.doe@example.com' },
          phoneNumber: { value: '123456789' }
        },
        gender: 'Male'
      },
      jasmine.objectContaining({
        headers: jasmine.any(HttpHeaders) // Ignora detalhes internos do HttpHeaders
      })
    );
    expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
  });

  it('should retrieve filtered patients', () => {
    const mockFilter = {
      pageNumber: 1,
      fullName: 'John',
      email: 'john.doe@example.com',
      phoneNumber: '123456789',
      medicalRecordNumber: 'MR123',
      dateOfBirth: '1990-01-01',
      gender: 'Male'
    };

    const mockResponse = [
      { id: 1, fullName: 'John Doe', email: 'john.doe@example.com' }
    ];

    httpClientSpy.get.and.returnValue(of(mockResponse)); // Simula a resposta

    service.getFilterPatients(mockFilter, '').subscribe((patients) => {
      expect(patients).toEqual(mockResponse);
    });

    // Verifica se o método foi chamado com os parâmetros corretos
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${environment.patients}/filter`,
      jasmine.objectContaining({
        params: jasmine.objectContaining({
          pageNumber: '1',
          fullName: 'John',
          email: 'john.doe@example.com',
          phoneNumber: '123456789',
          medicalRecordNumber: 'MR123',
          dateOfBirth: '1990-01-01',
          gender: 'Male'
        })
      })
    );

    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should retrieve all patients', () => {
    const mockResponse = [
      { id: 1, fullName: 'John Doe', email: 'john.doe@example.com' }
    ];

    // Simula a resposta da requisição GET
    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getPatients('').subscribe((patients) => {
      expect(patients).toEqual(mockResponse); // Verifica se a resposta é a esperada
    });

    // Verifica se a URL correta foi chamada
    expect(httpClientSpy.get).toHaveBeenCalledWith(
      `${environment.patients}`,
      jasmine.objectContaining({
        headers: jasmine.any(HttpHeaders) // Verifica se os cabeçalhos estão sendo enviados
      })
    );

    expect(httpClientSpy.get).toHaveBeenCalledTimes(1); // Verifica se a requisição foi feita apenas uma vez
  });

});
