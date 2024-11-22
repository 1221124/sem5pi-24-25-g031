import {TestBed} from '@angular/core/testing';
import {OperationRequestsService} from './operation-requests.service';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {of} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

describe('OperationRequestsService', () => {
  let service: OperationRequestsService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);
    TestBed.configureTestingModule({
      providers: [
        OperationRequestsService,
        {provide: HttpClient, useValue: httpClientSpy}
      ]
    });

    service = TestBed.inject(OperationRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {

    //'should retrieve a list of operation requests'
    it('should retrieve a list of operation requests', async () => {
      const mockOperationRequests = [{
        id: 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd',
        staff: '123456',
        patient: 'John Doe',
        operationType: 'Surgery',
        deadlineDate: '2021-10-10',
        priority: 'High',
        status: 'Pending',
        requestCode: 'RO1'
      }];

      httpClientSpy.get.and.returnValue(
        of(new HttpResponse({status: 200, body: mockOperationRequests}))
      );

      await service.getAll(
        /*Access Token*/ 'token'
      ).then(requests => {
        console.log('Response body:', requests.body);
        expect(requests.body.map(
          request => request.id
        )).toEqual(mockOperationRequests.map(
          request => request.id
        ));
      });

      const calledUrl = httpClientSpy.get.calls.mostRecent().args[0];
      expect(calledUrl).toBe(`${environment.operationRequests}`);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });

    //'should retrieve a list of priorities'
    it('should retrieve a list of priorities', async () => {
      const mockPriorities = ['High', 'Medium', 'Low'];

      httpClientSpy.get.and.returnValue(
        of(new HttpResponse({status: 200, body: mockPriorities}))
      );

      await service.getPriority(
        /*Access Token*/ 'token'
      ).then(requests => {
        expect(requests.body).toEqual(mockPriorities);
      });

      const calledUrl = httpClientSpy.get.calls.mostRecent().args[0];
      expect(calledUrl).toEqual(`${environment.enums}/priorities`);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });


    //'should retrieve a list of request statuses
    it('should retrieve a list of request statuses', async () => {
      const mockPriorities = ['Pending', 'Approved', 'Rejected'];

      httpClientSpy.get.and.returnValue(
        of(new HttpResponse({status: 200, body: mockPriorities}))
      );

      const transformedPriorities = mockPriorities.map(status => ({value: status}));

      await service.getRequestStatus(
        /*Access Token*/ 'token'
      ).then(requests => {
        expect(requests.body).toEqual(transformedPriorities);
      });

      const calledUrl = httpClientSpy.get.calls.mostRecent().args[0];
      expect(calledUrl).toEqual(`${environment.enums}/requestStatuses`);
      expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
    });
  });


  describe('post', () => {
    it('should create a new operation request', async () => {
      const mockOperationRequest = {
        Id: 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd',
        Staff: '123456',
        Patient: 'John Doe',
        OperationType: 'Surgery',
        DeadlineDate: '2021-10-10',
        RequestStatus: 'Pending',
        Priority: 'High'
      };

      httpClientSpy.post.and.returnValue(of(new HttpResponse({status: 201, body: mockOperationRequest})));

      service.post(
        mockOperationRequest.Id,
        mockOperationRequest.Staff,
        mockOperationRequest.Patient,
        mockOperationRequest.OperationType,
        mockOperationRequest.DeadlineDate,
        mockOperationRequest.Priority
      ).then(
        response => {
          expect(response).toEqual(
            {status: 201, body: mockOperationRequest}
          );
        }
      );

      const req = httpClientSpy.post.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.operationRequests}`);
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });


  describe('update', () => {
    it('should update an operation request', async () => {
      const mockOperationRequest = {
        Id: 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd',
        Staff: '123456',
        Patient: 'John Doe',
        OperationType: 'Surgery',
        DeadlineDate: '2021-10-10',
        RequestStatus: 'Pending',
        Priority: 'High'
      };

      httpClientSpy.put.and.returnValue(of(new HttpResponse({status: 200, body: mockOperationRequest})));

      service.put(
        /*Access Token*/'token',
        mockOperationRequest.Id,
        mockOperationRequest.DeadlineDate,
        mockOperationRequest.Priority,
        mockOperationRequest.RequestStatus
      ).then(
        response => {
          expect(response).toEqual(
            {status: 200, body: mockOperationRequest}
          );
        }
      )

      const req = httpClientSpy.put.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.operationRequests}`);
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('should delete an operation request', async () => {
      const mockOperationRequest = {
        Id: 'a5f6e9d2-3c8e-4bb6-a91b-32c4cfaf4cfd',
        Staff: '123456',
        Patient: 'John Doe',
        OperationType: 'Surgery',
        DeadlineDate: '2021-10-10',
        RequestStatus: 'Pending',
        Priority: 'High'
      };

      httpClientSpy.delete.and.returnValue(of(new HttpResponse({status: 200, body: mockOperationRequest.Id})));

      service.delete(
        /*Access Token*/ 'token',
        mockOperationRequest.Id
      ).then(
        response => {
          expect(response).toEqual(
            {status: 200, body: mockOperationRequest.Id}
          );
        }
      )

      const req = httpClientSpy.delete.calls.mostRecent().args[0];
      expect(req).toBe(`${environment.operationRequests}/${mockOperationRequest.Id}`);
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });
  });
});
