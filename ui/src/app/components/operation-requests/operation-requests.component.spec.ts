import { TestBed, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { OperationRequestsComponent } from './operation-requests.component';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';
import { StaffsService } from '../../services/staffs/staffs.service';
import { PatientsService } from '../../services/admin-patients/admin-patients.service';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { AuthService } from '../../services/auth/auth.service';
import { from } from 'rxjs';

describe('OperationRequestsComponent', () => {
  let component: OperationRequestsComponent;
  let fixture: ComponentFixture<OperationRequestsComponent>;

  let mockOperationRequestsService: jasmine.SpyObj<OperationRequestsService>;
  let mockStaffsService: jasmine.SpyObj<StaffsService>;
  let mockPatientsService: jasmine.SpyObj<PatientsService>;
  let mockOperationTypesService: jasmine.SpyObj<OperationTypesService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockOperationRequestsService = jasmine.createSpyObj('OperationRequestsService', [
      'getAll',
      'getRequestStatus',
      'getPriority',
      'post',
      'put',
      'delete'
    ]);

    mockStaffsService = jasmine.createSpyObj('StaffsService', ['getStaff']);

    mockPatientsService = jasmine.createSpyObj('PatientsService', ['getPatients']);

    mockOperationTypesService = jasmine.createSpyObj('OperationTypesService', ['getOperationTypes']);

    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken']);

    mockStaffsService.getStaff.and.returnValue(Promise.resolve(new HttpResponse({ status: 200, body: { staffs: [], totalItems: 0 } as any })));
    mockPatientsService.getPatients.and.returnValue(from(Promise.resolve(new HttpResponse({ status: 200, body: { patients: [], totalItems: 0 } }))));
    mockOperationTypesService.getOperationTypes.and.returnValue(Promise.resolve(new HttpResponse({ status: 200, body: { operationTypes: [], totalItems: 0 } as any })));

    mockOperationRequestsService.getAll.and.returnValue(Promise.resolve({ status: 200, body: [] }));
    mockOperationRequestsService.getPriority.and.returnValue(Promise.resolve({ status: 200, body: [] }));
    mockOperationRequestsService.getRequestStatus.and.returnValue(Promise.resolve({ status: 200, body: [] }));

    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mock-token');

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.stub();

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, OperationRequestsComponent],
      providers: [
        { provide: OperationRequestsService, useValue: mockOperationRequestsService },
        { provide: StaffsService, useValue: mockStaffsService },
        { provide: PatientsService, useValue: mockPatientsService },
        { provide: OperationTypesService, useValue: mockOperationTypesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize data on ngOnInit', (async () => {

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockOperationRequestsService.getAll).toHaveBeenCalledWith('mock-token');
    expect(mockStaffsService.getStaff).toHaveBeenCalledWith(component.filter, 'mock-token');
    expect(mockPatientsService.getPatients).toHaveBeenCalled();
    expect(mockOperationTypesService.getOperationTypes).toHaveBeenCalledWith(component.filter, 'mock-token');
  }));

  it('should redirect to login if not authenticated', (async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith('You are not authenticated or are not a doctor! Please login...');
    expect(mockAuthService.updateIsError).toHaveBeenCalledWith(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  }));

  it('should load operation requests', (async () => {
    const mockRequests = [{
      id: '1',
      staff: 'Staff 1',
      patient: 'Patient 1',
      operationType: 'Type 1',
      deadlineDate: '2024-01-01',
      priority: 'High',
      status: 'Pending',
      requestCode: 'REQ1'
    }];

    mockOperationRequestsService.getAll.and.returnValue(
      Promise.resolve({ status: 200, body: mockRequests })
    );

    await component.loadOperationRequests();

    expect(component.requests).toEqual(mockRequests);
    expect(component.message).toBe('Operation Requests obtained!');
  }));

  it('should handle errors when loading operation requests', (async () => {
    mockOperationRequestsService.getAll.and.returnValue(
      Promise.reject({ status: 404 })
    );

    await component.loadOperationRequests();

    expect(component.requests).toEqual([]);
    expect(component.message).toBe('No Operation Requests found!');
  }));

  it('should load priorities successfully', (async () => {
    const mockResponse = {
      status: 200,
      body: ['High', 'Medium', 'Low']
    };

    mockOperationRequestsService.getPriority.and.returnValue(
      Promise.resolve(mockResponse)
    );

    await component.loadPriority();

    expect(component.priorities).toEqual(['High', 'Medium', 'Low']);
    expect(component.message).toBe('Priorities obtained!');
    expect(component.success).toBeTrue();
  }));

  it('should load statuses successfully', (async () => {
    const mockResponse = {
      status: 200,
      body: [{ value: 'Pending' }, { value: 'Approved' }, { value: 'Rejected' }]
    };

    mockOperationRequestsService.getRequestStatus.and.returnValue(
      Promise.resolve(mockResponse)
    );

    await component.loadRequestStatus();

    expect(component.statuses).toEqual(['Pending', 'Approved', 'Rejected']);
    expect(component.message).toBe('Statuses obtained!');
    expect(component.success).toBeTrue();
  }));

  it('should filter operation requests', (async () => {
    const filteredRequests = [{
      id: '2',
      staff: 'Staff 2',
      patient: 'Patient 2',
      operationType: 'Type 2',
      deadlineDate: '2024-02-01',
      priority: 'Medium',
      status: 'Approved',
      requestCode: 'REQ1'
    }];

    mockOperationRequestsService.get.and.returnValue(
      Promise.resolve({ status: 200, body: filteredRequests })
    );

    await component.applyFilter();

    expect(component.requests).toEqual(filteredRequests);
    expect(component.message).toBe('');
  }));

  it('should load staff successfully', (async () => {
    const mockResponse = {
      status: 200,
      body: {
        staffs: [{
          Id: '',
          FullName: { FirstName: 'John', LastName: 'Doe' },
          licenseNumber: '123',
          specialization: '',
          staffRole: '',
          ContactInformation: { Email: '', PhoneNumber: '' },
          SlotAppointment: [{}],
          SlotAvailability: [{}],
          status: ''
        }],
        totalItems: 1
      }
    };

    mockStaffsService.getStaff.and.returnValue(
      Promise.resolve(mockResponse)
    );

    await component.loadStaffs();

    expect(component.staffs).toEqual([{
      Id: component.staffs[0].Id,
      FullName: {
        FirstName: component.staffs[0].FullName.FirstName,
        LastName: component.staffs[0].FullName.LastName
      },
      licenseNumber: component.staffs[0].licenseNumber,
      specialization: '',
      staffRole: '',
      ContactInformation: {
        Email: '',
        PhoneNumber: ''
      },
      SlotAppointment: [],
      SlotAvailability: [],
      status: ''
    }]);
    expect(component.message).toBe('Staffs obtained!');
    expect(component.success).toBeTrue();
  }));

  it('should load patients successfully', (async () => {
    const mockResponse = {
      status: 200,
      body: {
        patients: [{
          Id: '1',
          FullName: { FirstName: 'Jane', LastName: 'Smith' },
          medicalRecordNumber: 'MRN123',
          contactInformation: { Email: 'jane.smith@example.com', PhoneNumber: '123-456-7890' }
        }],
        totalItems: 1
      }
    };

    mockPatientsService.getPatients.and.returnValue(
      from(Promise.resolve(mockResponse))
    );

    await component.loadPatients();

    expect(component.patients).toEqual([{
      Id: '1',
      FullName: 'Jane Smith',
      medicalRecordNumber: 'MRN123',
      contactInformation: {
        Email: 'jane.smith@example.com',
        PhoneNumber: '123-456-7890'
      }
    }]);
    expect(component.message).toBe('Patients obtained!');
    expect(component.success).toBeTrue();
  }));

  it('should load operation types successfully', (async () => {
    const mockResponse = {
      status: 200,
      body: {
        operationTypes: [{
          Id: '1',
          Name: {Value: 'Surgery'},
          Specialization: 'Cardiology',
          RequiredStaff: [{
            Role: '',
            Specialization: '',
            Quantity: 1
          }],
          PhasesDuration: {
            Preparation: 0,
            Surgery: 0,
            Cleaning: 0
          },
          Status: ''
        }],
        totalItems: 1
      }
    };

    mockOperationTypesService.getOperationTypes.and.returnValue(Promise.resolve(mockResponse));

    await component.loadOperationTypes();

    expect(component.operationTypes).toEqual([{
      Id: '1',
      Name: 'Surgery',
      Specialization: 'Cardiology',
      RequiredStaff: [{
        Role: '',
        Specialization: '',
        Quantity: 1
      }],
      PhasesDuration: {
        Preparation: 0,
        Surgery: 0,
        Cleaning: 0
      },
      Status: ''
    }]);

    expect(component.message).toBe('Operation Types obtained!');
    expect(component.success).toBeTrue();
  }));
});
