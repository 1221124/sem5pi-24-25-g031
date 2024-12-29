import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { AppointmentsService } from './appointments.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Appointment } from '../../models/appointment.model';

describe('AppointmentsService', () => {
  let service: AppointmentsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        AppointmentsService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(AppointmentsService);
  });

  describe('getAll', () => {
    it('should return a list of appointments', async () => {
      const mockAppointments = {
        status: 200,
        body: {
          appointments: [
            {
              Id: '1',
              RequestCode: 'RC123',
              SurgeryRoomNumber: '101',
              AppointmentNumber: 'A123',
              AppointmentDate: { Start: '2024-12-29T10:00', End: '2024-12-29T12:00' },
              AssignedStaff: ['Dr. Smith', 'Dr. Jones']
            }
          ],
          totalItems: 1
        }
      };

      httpClientSpy.get.and.returnValue(of(mockAppointments));

      const result = await service.getAll('valid-token');

      expect(result.status).toBe(200);
      expect(result.body.appointments.length).toBe(1);
      expect(result.body.appointments[0].RequestCode).toBe('RC123');
    });

    it('should throw an error if response is unexpected', async () => {
      const mockErrorResponse = {
        status: 500,
        body: null
      };

      httpClientSpy.get.and.returnValue(of(mockErrorResponse));

      try {
        await service.getAll('valid-token');
      } catch (error) {
        expect(error.message).toBe('Unexpected response structure or status');
      }
    });
  });

  describe('create', () => {
    it('should successfully create an appointment', async () => {
      const mockAppointment: Appointment = {
        Id: '1',
        RequestCode: 'RC123',
        SurgeryRoomNumber: '101',
        AppointmentNumber: 'A123',
        AppointmentDate: { Start: '2024-12-29T10:00', End: '2024-12-29T12:00' },
        AssignedStaff: ['Dr. Smith', 'Dr. Jones']
      };

      const mockResponse = { status: 201 };

      httpClientSpy.post.and.returnValue(of(mockResponse));

      const result = await service.create(mockAppointment, 'valid-token');

      expect(httpClientSpy.post).toHaveBeenCalledWith(`${environment.appointments}`, jasmine.any(Object), jasmine.any(Object));
      expect(result.status).toBe(201);
    });

    it('should throw an error if required fields are missing', async () => {
      const mockAppointment: Appointment = {
        Id: '',
        RequestCode: '',
        SurgeryRoomNumber: '',
        AppointmentNumber: '',
        AppointmentDate: { Start: '', End: '' },
        AssignedStaff: []
      };

      try {
        await service.create(mockAppointment, 'valid-token');
      } catch (error) {
        expect(error.message).toBe('Required fields are missing');
      }
    });

    it('should handle HTTP errors gracefully', async () => {
      const mockAppointment: Appointment = {
        Id: '1',
        RequestCode: 'RC123',
        SurgeryRoomNumber: '101',
        AppointmentNumber: 'A123',
        AppointmentDate: { Start: '2024-12-29T10:00', End: '2024-12-29T12:00' },
        AssignedStaff: ['Dr. Smith', 'Dr. Jones']
      };

      const mockErrorResponse = { status: 400, message: 'Bad Request' };

      httpClientSpy.post.and.returnValue(throwError(mockErrorResponse));

      try {
        await service.create(mockAppointment, 'valid-token');
      } catch (error) {
        expect(error.status).toBe(400);
        expect(error.message).toBe('Bad Request');
      }
    });
  });

  describe('getByPatient', () => {
    it('should return appointments for a given patient', async () => {
      const mockAppointments = {
        status: 200,
        body: {
          appointments: [
            {
              Id: '1',
              RequestCode: 'RC123',
              SurgeryRoomNumber: '101',
              AppointmentNumber: 'A123',
              AppointmentDate: { Start: '2024-12-29T10:00', End: '2024-12-29T12:00' },
              AssignedStaff: ['Dr. Smith', 'Dr. Jones']
            }
          ],
          totalItems: 1
        }
      };

      httpClientSpy.get.and.returnValue(of(mockAppointments));

      const result = await service.getByPatient(12345, 'valid-token');

      expect(result.status).toBe(200);
      expect(result.body.appointments.length).toBe(1);
      expect(result.body.appointments[0].RequestCode).toBe('RC123');
    });
  });

  describe('delete', () => {
    it('should delete an appointment', async () => {
      const mockResponse = { status: 200 };

      httpClientSpy.delete.and.returnValue(of(mockResponse));

      const result = await service.delete('1', 'valid-token');

      expect(httpClientSpy.delete).toHaveBeenCalledWith(`${environment.appointments}/1`, jasmine.any(Object));
      expect(result.status).toBe(200);
    });

    it('should throw an error if the ID format is invalid', async () => {
      try {
        await service.delete('invalid-id', 'valid-token');
      } catch (error) {
        expect(error.message).toBe('Invalid ID format. Please provide a valid GUID.');
      }
    });
  });
});