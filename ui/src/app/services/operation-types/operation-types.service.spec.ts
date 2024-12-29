import { TestBed } from '@angular/core/testing';
import { OperationTypesService } from './operation-types.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

describe('OperationTypesService', () => {
  let service: OperationTypesService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        OperationTypesService,
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });

    service = TestBed.inject(OperationTypesService);
  });

  describe('post', () => {
    it('should create a new operation type', async () => {
      const mockOperationType = {
        Id: 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd',
        OperationTypeCode: 'OT123',
        Name: 'Surgery',
        Specialization: "Cardiology",
        RequiredStaff: [{ Role: 'Doctor', Specialization: "Cardiology", Quantity: 2, IsRequiredInPreparation: true, IsRequiredInSurgery: true, IsRequiredInCleaning: true }],
        PhasesDuration: { Preparation: 30, Surgery: 60, Cleaning: 15 },
        Status: "Active",
        Version: 1
      };

      const mockResponse = new HttpResponse({ status: 201 });

      httpClientSpy.post.and.returnValue(of(mockResponse));

      service.post(mockOperationType, '').then(response => {
        expect(response.status).toBe(201);
      });

      const req = httpClientSpy.post.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.operationTypes}`);
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateOperationType', () => {
    it('should update an operation type', async () => {
      const mockOperationType = {
        Id: 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd',
        OperationTypeCode: 'OT123',
        Name: 'Updated Surgery',
        Specialization: 'Cardiology',
        RequiredStaff: [{ Role: 'Doctor', Specialization: 'Cardiology', Quantity: 3, IsRequiredInPreparation: true, IsRequiredInSurgery: true, IsRequiredInCleaning: true }],
        PhasesDuration: { Preparation: 20, Surgery: 40, Cleaning: 10 },
        Status: 'Active',
        Version: 1
      };

      const mockResponse = new HttpResponse({ status: 200 });

      httpClientSpy.put.and.returnValue(of(mockResponse));

      service.updateOperationType(mockOperationType.Id, mockOperationType, '').then(response => {
        expect(response.status).toBe(200);
      });

      const req = httpClientSpy.put.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.operationTypes}/${mockOperationType.Id}`);
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteOperationType', () => {
    it('should delete an operation type', async () => {
      const id = 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd';

      const mockResponse = new HttpResponse({ status: 200 });

      httpClientSpy.delete.and.returnValue(of(mockResponse));

      service.deleteOperationType(id, '').then(response => {
        expect(response.status).toBe(200);
      });

      const req = httpClientSpy.delete.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.operationTypes}/${id}`);
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });
  });
});
