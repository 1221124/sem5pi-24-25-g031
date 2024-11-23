import {TestBed, ComponentFixture} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HttpResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import {OperationRequestsComponent} from './operation-requests.component';
import {OperationRequestsService} from '../../services/operation-requests/operation-requests.service';
import {StaffsService} from '../../services/staffs/staffs.service';
import {PatientsService} from '../../services/admin-patients/admin-patients.service';
import {OperationTypesService} from '../../services/operation-types/operation-types.service';
import {AuthService} from '../../services/auth/auth.service';
import {from} from 'rxjs';

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

    mockStaffsService = jasmine.createSpyObj('mockStaffsService', ['getStaff']);
    mockStaffsService.getStaff.and.returnValue(Promise.resolve(new HttpResponse({
      status: 200,
      body: {staffs: [], totalItems: 0} as any
    })));

    mockPatientsService = jasmine.createSpyObj('mockPatientsService', ['getPatients']);
    mockPatientsService.getPatients.and.returnValue(from(Promise.resolve(new HttpResponse({
      status: 200,
      body: {patients: [], totalItems: 0}
    }))));

    mockOperationTypesService = jasmine.createSpyObj('mockOperationTypesService', ['getOperationTypes']);
    mockOperationTypesService.getOperationTypes.and.returnValue(Promise.resolve(new HttpResponse({
      status: 200,
      body: {operationTypes: [], totalItems: 0} as any
    })));

    mockOperationRequestsService.getAll.and.returnValue(Promise.resolve({status: 200, body: []}));
    mockOperationRequestsService.getPriority.and.returnValue(Promise.resolve({status: 200, body: []}));
    mockOperationRequestsService.getRequestStatus.and.returnValue(Promise.resolve({status: 200, body: []}));

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'updateMessage',
      'updateIsError',
      'extractEmailFromAccessToken'
    ]);

    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockAccessToken');
    mockAuthService.extractEmailFromAccessToken.and.returnValue('mockEmail');

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.stub();

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule, OperationRequestsComponent],
      providers: [
        {provide: OperationRequestsService, useValue: mockOperationRequestsService},
        {provide: StaffsService, useValue: mockStaffsService},
        {provide: PatientsService, useValue: mockPatientsService},
        {provide: OperationTypesService, useValue: mockOperationTypesService},
        {provide: AuthService, useValue: mockAuthService},
        {provide: Router, useValue: mockRouter}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      mockAuthService.isAuthenticated = jasmine.createSpy().and.returnValue(true);
      mockAuthService.getToken = jasmine.createSpy().and.returnValue('mockAccessToken');
      mockAuthService.extractEmailFromAccessToken = jasmine.createSpy().and.returnValue('mockEmail');
    });

    it('should initialize operation requests', async () => {
      mockOperationRequestsService.getAll.and.returnValue(Promise.resolve({
        status: 200, body: [
          {
            id: '1',
            staff: 'null',
            patient: 'John Doe',
            operationType: 'null',
            deadlineDate: 'null',
            priority: 'null',
            status: 'Pending',
            requestCode: 'null'
          },
          {
            id: '2',
            staff: 'null',
            patient: 'Jane Doe',
            operationType: 'null',
            deadlineDate: 'null',
            priority: 'null',
            status: 'Approved',
            requestCode: 'null'
          }
        ]
      }));

      await component.loadOperationRequests();

      expect(component.requests.map(
        (request: {
          id: string,
          staff: string,
          patient: string,
          operationType: string,
          deadlineDate: string,
          priority: string,
          status: string,
          requestCode: string
        }) => ({
          id: request.id,
          staff: request.staff,
          patient: request.patient,
          operationType: request.operationType,
          deadlineDate: request.deadlineDate,
          priority: request.priority,
          status: request.status,
          requestCode: request.requestCode
        })
      )).toEqual([
        {
          id: '1',
          staff: 'null',
          patient: 'John Doe',
          operationType: 'null',
          deadlineDate: 'null',
          priority: 'null',
          status: 'Pending',
          requestCode: 'null'
        },
        {
          id: '2',
          staff: 'null',
          patient: 'Jane Doe',
          operationType: 'null',
          deadlineDate: 'null',
          priority: 'null',
          status: 'Approved',
          requestCode: 'null'
        }
      ]);
    });

    it('should initialize staffs', async () => {
      mockStaffsService.getStaff.and.returnValue(Promise.resolve({
        status: 200,
        body: {
          staffs: [
            {
              Id: '1',
              FullName: {FirstName: 'John', LastName: 'Doe'},
              licenseNumber: '123',
              specialization: 'Cardiology',
              staffRole: '',
              ContactInformation: {Email: '', PhoneNumber: ''},
              status: '',
              SlotAppointment: [],
              SlotAvailability: []
            },
            {
              Id: '2',
              FullName: {FirstName: 'Jane', LastName: 'Doe'},
              licenseNumber: '456',
              specialization: 'Neurology',
              staffRole: '',
              ContactInformation: {Email: '', PhoneNumber: ''},
              status: '',
              SlotAppointment: [],
              SlotAvailability: []
            }
          ],
          totalItems: 2
        }
      }));

      await component.loadStaffs();

      expect(component.staffs.map(
        (staff: {
          Id: string,
          FullName: { FirstName: string, LastName: string },
          licenseNumber: string,
          specialization: string,
          staffRole: string,
          ContactInformation: { Email: string, PhoneNumber: string },
          status: string,
          SlotAppointment: any[],
          SlotAvailability: any[]
        }) => ({
          Id: staff.Id,
          FullName: {
            FirstName: staff.FullName.FirstName,
            LastName: staff.FullName.LastName
          },
          licenseNumber: staff.licenseNumber,
          specialization: staff.specialization,
          staffRole: staff.staffRole,
          ContactInformation: {
            Email: staff.ContactInformation.Email,
            PhoneNumber: staff.ContactInformation.PhoneNumber
          },
          status: staff.status,
          SlotAppointment: staff.SlotAppointment,
          SlotAvailability: staff.SlotAvailability
        })
      )).toEqual([
        {
          Id: '1',
          FullName: {
            FirstName: 'John',
            LastName: 'Doe'
          },
          licenseNumber: '123',
          specialization: 'Cardiology',
          staffRole: '',
          ContactInformation: {Email: '', PhoneNumber: ''},
          status: '',
          SlotAppointment: [],
          SlotAvailability: []
        },
        {
          Id: '2',
          FullName: {
            FirstName: 'Jane',
            LastName: 'Doe'
          },
          licenseNumber: '456',
          specialization: 'Neurology',
          staffRole: '',
          ContactInformation: {Email: '', PhoneNumber: ''},
          status: '',
          SlotAppointment: [],
          SlotAvailability: []
        }
      ]);
    });


    it('should initialize patients', async () => {
      // Arrange: Provide mock patient data directly
      const mockPatients = [
        {
          appointmentHistory: [
            { start: '2024-11-01T10:00:00', end: '2024-11-01T11:00:00' },
            { start: '2024-11-02T14:00:00', end: '2024-11-02T15:00:00' }
          ]
        },
        {
          appointmentHistory: [
            { start: '2024-11-03T12:00:00', end: '2024-11-03T13:00:00' }
          ]
        }
      ];

      // Mock the getPatients method to return an Observable of the array directly
      mockPatientsService.getPatients.and.returnValue(from(Promise.resolve(mockPatients)));

      // Act: Call the component method
      await component.loadPatients();

      // Assert: Verify patients were processed correctly
      expect(component.patients).toEqual([
        {
          appointmentHistory: [
            { start: new Date('2024-11-01T10:00:00'), end: new Date('2024-11-01T11:00:00') },
            { start: new Date('2024-11-02T14:00:00'), end: new Date('2024-11-02T15:00:00') }
          ]
        },
        {
          appointmentHistory: [
            { start: new Date('2024-11-03T12:00:00'), end: new Date('2024-11-03T13:00:00') }
          ]
        }
      ]);
      expect(component.message).toBe('Patients obtained!');
      expect(component.success).toBeTrue();
    });


    it('should initialize operation types', async () => {
      mockOperationTypesService.getOperationTypes.and.returnValue(
        Promise.resolve({
          status: 200,
          body: {
            operationTypes: [
              {
                Id: '1',
                Name: 'Cardiology',
                Specialization: 'Cardiology',
                RequiredStaff: [],
                PhasesDuration: {Preparation: 10, Surgery: 30, Cleaning: 20},
                Status: 'Active'
              },
              {
                Id: '2',
                Name: 'Neurology',
                Specialization: 'Neurology',
                RequiredStaff: [],
                PhasesDuration: {Preparation: 15, Surgery: 60, Cleaning: 45},
                Status: 'Active'
              }
            ],
            totalItems: 2
          }
        })
      );

      await component.loadOperationTypes();

      expect(component.operationTypes.map(
        (operationType: {
          Id: string,
          Name: string,
          Specialization: string,
          RequiredStaff: any[],
          PhasesDuration: { Preparation: number, Surgery: number, Cleaning: number },
          Status: string
        }) => ({
          Id: operationType.Id,
          Name: operationType.Name,
          Specialization: operationType.Specialization,
          RequiredStaff: operationType.RequiredStaff,
          PhasesDuration: operationType.PhasesDuration,
          Status: operationType.Status
        })
      )).toEqual([
        {
          Id: '1',
          Name: 'Cardiology',
          Specialization: 'Cardiology',
          RequiredStaff: [],
          PhasesDuration: {Preparation: 10, Surgery: 30, Cleaning: 20},
          Status: 'Active'
        },
        {
          Id: '2',
          Name: 'Neurology',
          Specialization: 'Neurology',
          RequiredStaff: [],
          PhasesDuration: {Preparation: 15, Surgery: 60, Cleaning: 45},
          Status: 'Active'
        }
      ]);
    });

    it('should initialize priorities', async () => {
        mockOperationRequestsService.getPriority.and.returnValue(
          Promise.resolve({
            status: 200,
            body: ['Low', 'Medium', 'High']
          })
        );

        await component.loadPriority();

        expect(component.priorities).toEqual(
          ['Low', 'Medium', 'High']
        );
      });

    it('should initialize request status', async () => {
        mockOperationRequestsService.getRequestStatus.and.returnValue(
          Promise.resolve({
            status: 200,
            body: ['Pending', 'Approved', 'Rejected'].map(status => ({ value: status }))
          })
        );

        await component.loadRequestStatus();

        expect(component.statuses).toEqual(
          ['Pending', 'Approved', 'Rejected']
        );
      }
    );

  });
});
