import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrologComponent } from './prolog.component';
import { AuthService } from '../../services/auth/auth.service';
import { PrologService } from '../../services/prolog/prolog.service';
import { SurgeryRoomsService } from '../../services/surgery-rooms/surgery-rooms.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpResponse } from '@angular/common/http';

describe('PrologComponent', () => {
  let component: PrologComponent;
  let fixture: ComponentFixture<PrologComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let prologServiceSpy: jasmine.SpyObj<PrologService>;
  let surgeryRoomsServiceSpy: jasmine.SpyObj<SurgeryRoomsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken', 'extractRoleFromAccessToken', 'updateMessage', 'updateIsError']);
    const prologSpy = jasmine.createSpyObj('PrologService', ['runProlog']);
    const surgeryRoomsSpy = jasmine.createSpyObj('SurgeryRoomsService', ['get']);
    const router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [PrologComponent],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: PrologService, useValue: prologSpy },
        { provide: SurgeryRoomsService, useValue: surgeryRoomsSpy },
        { provide: Router, useValue: router },
        DatePipe
      ]
    });

    fixture = TestBed.createComponent(PrologComponent);
    component = fixture.componentInstance;

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    prologServiceSpy = TestBed.inject(PrologService) as jasmine.SpyObj<PrologService>;
    surgeryRoomsServiceSpy = TestBed.inject(SurgeryRoomsService) as jasmine.SpyObj<SurgeryRoomsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with the correct values', async () => {
    const today = new Date().toISOString().split('T')[0];
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.getToken.and.returnValue('valid-token');
    authServiceSpy.extractRoleFromAccessToken.and.returnValue('admin');
    
    await component.ngOnInit();

    expect(component.minDate).toBe(today);
    expect(authServiceSpy.isAuthenticated).toHaveBeenCalled();
    expect(authServiceSpy.getToken).toHaveBeenCalled();
    expect(authServiceSpy.extractRoleFromAccessToken).toHaveBeenCalled();
    expect(authServiceSpy.updateMessage).not.toHaveBeenCalled();
  });

  it('should navigate to login if user is not authenticated', async () => {
    authServiceSpy.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    expect(authServiceSpy.updateMessage).toHaveBeenCalledWith('You are not authenticated or are not an admin! Please login...');
  });

  it('should navigate to login if user is not an admin', async () => {
    authServiceSpy.isAuthenticated.and.returnValue(true);
    authServiceSpy.extractRoleFromAccessToken.and.returnValue('user');

    await component.ngOnInit();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['']);
    expect(authServiceSpy.updateMessage).toHaveBeenCalledWith('You are not authenticated or are not an admin! Redirecting to login...');
  });

  it('should fetch surgery rooms', async () => {
    const mockRooms = { status: 200, body: {
        surgeryRooms: [
            { Id: '1', SurgeryRoomNumber: 'or1', RoomTypeCode: 'code', RoomCapacity: 'capacity', AssignedEquipment: 'table', CurrentStatus: 'status', MaintenanceSlots: [] },
            ], totalItems: 1 }
        };
    surgeryRoomsServiceSpy.get.and.returnValue(Promise.resolve(mockRooms));

    await component.fetchSurgeryRooms();

    expect(component.surgeryRooms.length).toBe(2);
    expect(component.surgeryRooms).toEqual(['or1']);
    expect(surgeryRoomsServiceSpy.get).toHaveBeenCalled();
  });

  it('should handle error when fetching surgery rooms', async () => {
    surgeryRoomsServiceSpy.get.and.returnValue(Promise.reject('error'));

    await component.fetchSurgeryRooms();

    expect(component.surgeryRooms.length).toBe(0);
    expect(surgeryRoomsServiceSpy.get).toHaveBeenCalled();
  });

  it('should validate date correctly', () => {
    const today = new Date().toISOString().split('T')[0];
    component.surgeryDate = today;

    expect(component.isDateValid()).toBeFalse();
    
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    component.surgeryDate = futureDate.toISOString().split('T')[0];

    expect(component.isDateValid()).toBeTrue();
  });

  it('should enable buttons when conditions are met', () => {
    component.surgeryDate = '2024-12-30';
    component.isSpecificRoomSelected = true;
    component.surgeryRoom = '101';

    expect(component.areButtonsEnabled()).toBeTrue();

    component.surgeryRoom = '';
    expect(component.areButtonsEnabled()).toBeFalse();

    component.surgeryRoom = '101';
    component.surgeryDate = '2023-12-30';
    expect(component.areButtonsEnabled()).toBeFalse();
  });

  it('should call runProlog and handle success', async () => {
    prologServiceSpy.runProlog.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));

    component.surgeryRoom = '101';
    component.surgeryDate = '2024-12-30';
    
    await component.runProlog('option');
    
    expect(prologServiceSpy.runProlog).toHaveBeenCalledWith('option', '101', '2024-12-30', 'valid-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin/appointments']);
  });

  it('should handle error in runProlog', async () => {
    const mockError = { status: 400, error: 'Bad request' };
    prologServiceSpy.runProlog.and.returnValue(Promise.reject(mockError));

    component.surgeryRoom = '101';
    component.surgeryDate = '2024-12-30';
    
    await component.runProlog('option');

    expect(prologServiceSpy.runProlog).toHaveBeenCalledWith('option', '101', '2024-12-30', 'valid-token');
    expect(component.loading).toBeFalse();
  });

  it('should clear the form after running prolog', async () => {
    component.surgeryRoom = '101';
    component.surgeryDate = '2024-12-30';
    component.isSpecificRoomSelected = true;

    component.clearForm();
    
    expect(component.surgeryRoom).toBe('');
    expect(component.surgeryDate).toBe('');
    expect(component.isSpecificRoomSelected).toBeFalse();
  });

  it('should navigate back to admin page', () => {
    component.back();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/admin']);
  });
});
