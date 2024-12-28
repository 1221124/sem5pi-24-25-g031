import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AppointmentsComponent } from './appointments.component';
import { AppointmentsService } from '../../../services/appointments/appointments.service';
import { AuthService } from '../../../services/auth/auth.service';
import { OperationRequestsService } from '../../../services/operation-requests/operation-requests.service';
import { Location } from '@angular/common';

const mockAppointmentsService = {
  getAll: jasmine.createSpy('getAll').and.returnValue(
    Promise.resolve({ body: { appointments: [] } })
  ),
  delete: jasmine.createSpy('delete').and.returnValue(Promise.resolve()),
};

const mockAuthService = {
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token'),
  extractRoleFromAccessToken: jasmine.createSpy('extractRoleFromAccessToken').and.returnValue('admin'),
  updateMessage: jasmine.createSpy('updateMessage'),
  updateIsError: jasmine.createSpy('updateIsError'),
};

const mockOperationRequestsService = {
  getAll: jasmine.createSpy('getAll').and.returnValue(Promise.resolve({ body: [] })),
  get: jasmine.createSpy('get').and.returnValue(Promise.resolve({ body: [] })),
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
  url: '/admin/appointments',
};

const mockActivatedRoute = {
  queryParams: of({}),
};

const mockLocation = {
  go: jasmine.createSpy('go'),
};

describe('AppointmentsComponent', () => {
  let component: AppointmentsComponent;
  let fixture: ComponentFixture<AppointmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppointmentsComponent],
      providers: [
        { provide: AppointmentsService, useValue: mockAppointmentsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: OperationRequestsService, useValue: mockOperationRequestsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Location, useValue: mockLocation },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load appointments', fakeAsync(async () => {
    spyOn(component, 'loadAppointments').and.callThrough();

    await component.ngOnInit();
    tick();

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(component.loadAppointments).toHaveBeenCalled();
  }));

  it('should navigate to login if not authenticated', fakeAsync(() => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();
    tick();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not an admin or doctor! Please login...'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  }));

  it('should filter appointments by surgery room number', fakeAsync(async () => {
    const mockAppointments = [
      { SurgeryRoomNumber: 'Room1', AppointmentNumber: '001' },
      { SurgeryRoomNumber: 'Room2', AppointmentNumber: '002' },
    ];

    mockAppointmentsService.getAll.and.returnValue(
      Promise.resolve({ body: { appointments: mockAppointments } })
    );

    component.filter.surgeryRoomNumber = 'Room1';
    await component.loadAppointments();
    tick();

    expect(component.appointments.length).toBe(1);
    expect(component.appointments[0].SurgeryRoomNumber).toBe('Room1');
  }));

  it('should handle errors when loading appointments', fakeAsync(async () => {
    mockAppointmentsService.getAll.and.returnValue(
      Promise.reject({ status: 401 })
    );

    await component.loadAppointments();
    tick();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authorized to view Appointments! Please log in...'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  }));

  it('should delete an appointment', fakeAsync(async () => {
    const mockAppointment = {
      Id: '1',
      RequestCode: 'req123',
      SurgeryRoomNumber: 'Room1',
      AppointmentNumber: '001',
      AppointmentDate: {
        Start: '2024-12-31T10:00:00',
        End: '2024-12-31T11:00:00',
      },
      AssignedStaff: ['staff1']
    };

    await component.onDelete(mockAppointment);
    tick();

    expect(mockAppointmentsService.delete).toHaveBeenCalledWith(
      mockAppointment.Id,
      'mock-token'
    );
    expect(mockAuthService.updateMessage).not.toHaveBeenCalledWith(jasmine.any(String));
  }));

  it('should navigate back for doctors', () => {
    component.isDoctor = true;
    component.back();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/doctor']);
  });

  it('should navigate back for admins', () => {
    component.isDoctor = false;
    component.back();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin']);
  });
});