import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppointmentsFormComponent } from './appointments-form.component';
import { AuthService } from '../../../services/auth/auth.service';
import { AppointmentsService } from '../../../services/appointments/appointments.service';
import { OperationRequestsService } from '../../../services/operation-requests/operation-requests.service';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { StaffsService } from '../../../services/staffs/staffs.service';
import { SurgeryRoomsService } from '../../../services/surgery-rooms/surgery-rooms.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

describe('AppointmentsFormComponent', () => {
  let component: AppointmentsFormComponent;
  let fixture: ComponentFixture<AppointmentsFormComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockAppointmentsService: jasmine.SpyObj<AppointmentsService>;
  let mockOperationRequestsService: jasmine.SpyObj<OperationRequestsService>;
  let mockOperationTypesService: jasmine.SpyObj<OperationTypesService>;
  let mockStaffsService: jasmine.SpyObj<StaffsService>;
  let mockSurgeryRoomsService: jasmine.SpyObj<SurgeryRoomsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken', 'extractRoleFromAccessToken', 'updateMessage', 'updateIsError']);
    mockAppointmentsService = jasmine.createSpyObj('AppointmentsService', ['create', 'update']);
    mockOperationRequestsService = jasmine.createSpyObj('OperationRequestsService', ['get']);
    mockOperationTypesService = jasmine.createSpyObj('OperationTypesService', ['getByCode']);
    mockStaffsService = jasmine.createSpyObj('StaffsService', ['getStaffAvailable']);
    mockSurgeryRoomsService = jasmine.createSpyObj('SurgeryRoomsService', ['getAvailable']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppointmentsFormComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: AppointmentsService, useValue: mockAppointmentsService },
        { provide: OperationRequestsService, useValue: mockOperationRequestsService },
        { provide: OperationTypesService, useValue: mockOperationTypesService },
        { provide: StaffsService, useValue: mockStaffsService },
        { provide: SurgeryRoomsService, useValue: mockSurgeryRoomsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsFormComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if user is not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not a doctor! Please login...'
    );
    expect(mockAuthService.updateIsError).toHaveBeenCalledWith(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should redirect to login if user is not a doctor', async () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('token');
    mockAuthService.extractRoleFromAccessToken.and.returnValue('nurse');

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not a doctor! Redirecting to login...'
    );
    expect(mockAuthService.updateIsError).toHaveBeenCalledWith(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should initialize data successfully when request code is valid', async () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.extractRoleFromAccessToken.and.returnValue('doctor');
    component.request = {
      id: '',
      staff: '',
      patient: '',
      operationType: '',
      deadlineDate: '2024-12-31T12:00:00',
      priority: '',
      status: '',
      requestCode: 'req123',
    };

    spyOn(component, 'getRequiredStaff').and.callFake(async () => {});

    await component.ngOnInit();

    expect(component.minDate).toBeDefined();
    expect(component.maxDate).toBe('2024-12-31T12:00:00');
    expect(component.appointment.RequestCode).toBe('req123');
    expect(component.appointment.AppointmentNumber).toBe('ap123');
    expect(component.getRequiredStaff).toHaveBeenCalled();
  });

  it('should calculate appointment duration successfully', async () => {
    component.appointment.AppointmentDate.Start = '2024-12-31T10:00:00';

    const mockRequests = [
      {
        Id: '1',
        Staff: 'staff1',
        Patient: 'patient1',
        OperationType: 'op1',
        DeadlineDate: '2025-11-11T00:00:00',
        Priority: 'High',
        Status: 'Pending',
        RequestCode: 'req123',
      },
    ];
    mockOperationRequestsService.get.and.returnValue(Promise.resolve({status: 200, body: mockRequests}));

    const mockOperationType = {
      Id: '1',
      OperationTypeCode: 'typ1',
      Name: 'Operation Type',
      Specialization: 'Specialization',
      RequiredStaff: [
        {
          Role: 'Role',
          Specialization: 'Specialization',
          Quantity: 1,
          IsRequiredInPreparation: true,
          IsRequiredInSurgery: true,
          IsRequiredInCleaning: true
        }
      ],
      PhasesDuration: {
        Preparation: 60,
        Surgery: 30,
        Cleaning: 30,
      },
      Status: 'Active',
      Version: 1
    };

    mockOperationTypesService.getByCode.and.returnValue(Promise.resolve({status: 200, body: mockOperationType}));

    await component.getAppointmentDuration();

    expect(component.appointment.AppointmentDate.End).toBe('2024-12-31T12:00:00');
  });

  it('should emit submit event on valid form submission', async () => {
    spyOn(component.submit, 'emit');
    component.appointment = {
      Id: '',
      RequestCode: 'req123',
      SurgeryRoomNumber: 'room1',
      AppointmentNumber: 'ap123',
      AppointmentDate: { Start: '2024-12-31T10:00:00', End: '2024-12-31T12:00:00' },
      AssignedStaff: ['staff1'],
    };

    mockAppointmentsService.create.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));

    await component.submitForm();

    expect(mockAppointmentsService.create).toHaveBeenCalledWith(component.appointment, component.accessToken);
    expect(component.submit.emit).toHaveBeenCalledWith(component.appointment);
  });

  it('should emit cancel event on cancel form', () => {
    spyOn(component.cancel, 'emit');

    component.cancelForm();

    expect(component.cancel.emit).toHaveBeenCalled();
  });
});