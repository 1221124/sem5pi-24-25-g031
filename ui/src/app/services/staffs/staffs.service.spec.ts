import { TestBed } from '@angular/core/testing';
import { StaffsService } from './staffs.service';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('StaffsService', () => {
  let service: StaffsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        StaffsService,
        {provide: HttpClient, useValue: httpClientSpy}
      ]
    });

    service = TestBed.inject(StaffsService);
  });

  describe('getStaffRoles', () => {
    it('should retrieve a list of staff roles', async () => {
      const mockStaffRoles = ['Doctor', 'Nurse', 'Admin'];

      httpClientSpy.get.and.returnValue(of(mockStaffRoles));

      service.getStaffRoles().then(roles => {
        expect(roles).toEqual(mockStaffRoles);
      });

      const req = httpClientSpy.get.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.enums}/staffRoles`);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getSpecializations', () => {
    it('should retrieve a list of specializations', async () => {
      const mockSpecializations = ['Cardiology', 'Orthopedics'];

      httpClientSpy.get.and.returnValue(of(mockSpecializations));

      service.getSpecializations().then(specializations => {
        expect(specializations).toEqual(mockSpecializations);
      });

      const req = httpClientSpy.get.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.enums}/specializations`);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('getStaff', () => {
    it('should retrieve a list of staff based on filter', async () => {
      const mockStaff = {
        Id: '0e8cc85e-46ce-4ec2-b5a1-1089cb83a0d6',
        FullName: {
          FirstName: 'Jane',
          LastName: 'Doe'
        },
        licenseNumber: 'D20241',
        specialization: 'Cardiology',
        staffRole: 'Doctor',
        ContactInformation: {
          Email: 'jane.doe@example.com',
          PhoneNumber: '1234567890'
        },
        status: 'Active',
        SlotAppointment: [
          {
            Start: '',
            End: ''
          }
        ],
        SlotAvailability: [
          {
            Start: '',
            End: ''
          }
        ]
      };

      const filter = { pageNumber: 1, name: 'John', email: '', specialization: '' };
      const mockResponse = new HttpResponse({ status: 201 });

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.post(mockStaff,'').then(response => {
        expect(response.status).toBe(201);
      });

      const req = httpClientSpy.post.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.staffs}`);
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('post', () => {
    it('should create a new staff', async () => {
      const mockStaff = {
        Id: '0e8cc85e-46ce-4ec2-b5a1-1089cb83a0d6',
        FullName: {
          FirstName: 'Jane',
          LastName: 'Doe'
        },
        licenseNumber: '',
        specialization: 'Cardiology',
        staffRole: 'Doctor',
        ContactInformation: {
          Email: 'jane.doe@example.com',
          PhoneNumber: '1234567890'
        },
        status: '',
        SlotAppointment: [
          {
            Start: '',
            End: ''
          }
        ],
        SlotAvailability: [
          {
            Start: '',
            End: ''
          }
        ]
      };

      const mockResponse = new HttpResponse({ status: 201 });

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.post(mockStaff, '').then(response => {
        expect(response.status).toBe(201);
      })

      const req = httpClientSpy.post.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.staffs}`);
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('should update an existing staff', async () => {
      const mockStaff = {
        Id: '0e8cc85e-46ce-4ec2-b5a1-1089cb83a0d6',
        FullName: {
          FirstName: 'Jane',
          LastName: 'Doe'
        },
        licenseNumber: '',
        specialization: 'Cardiology',
        staffRole: 'Doctor',
        ContactInformation: {
          Email: 'jane.doe@updated.com',
          PhoneNumber: '1234567890'
        },
        status: '',
        SlotAppointment: [
          {
            Start: '',
            End: ''
          }
        ],
        SlotAvailability: [
          {
            Start: '',
            End: ''
          }
        ]
      };

      const mockResponse = new HttpResponse({ status: 200 });

      httpClientSpy.put.and.returnValue(of(mockResponse));

      service.update(mockStaff.Id, mockStaff, '').then(response => {
        expect(response.status).toBe(200);
      });

      const req = httpClientSpy.put.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.staffs}/update/${mockStaff.ContactInformation.Email}`);
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteStaff', () => {
    it('should delete a staff member', async () => {
      const staffId = 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd';
      const mockResponse = new HttpResponse({ status: 200 });

      // Spy on the HTTP DELETE request
      httpClientSpy.delete.and.returnValue(of(mockResponse));

      service.deleteStaff(staffId, '').then(response => {
        expect(response.status).toBe(200);
      });

      const req = httpClientSpy.delete.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.staffs}/${staffId}`);
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });
  });
});
