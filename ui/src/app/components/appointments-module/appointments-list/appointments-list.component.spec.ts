import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AppointmentsListComponent } from './appointments-list.component';
import { AuthService } from '../../../services/auth/auth.service';

describe('AppointmentsListComponent', () => {
  let component: AppointmentsListComponent;
  let fixture: ComponentFixture<AppointmentsListComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken', 'extractRoleFromAccessToken', 'updateMessage', 'updateIsError']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [AppointmentsListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppointmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should redirect to login if not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not an admin or a doctor! Please login...'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should redirect to login if user role is invalid', async () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('fake-token');
    mockAuthService.extractRoleFromAccessToken.and.returnValue('user');

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not an admin or a doctor! Redirecting to login...'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should emit filterChange event on onFilterChange()', () => {
    spyOn(component.filterChange, 'emit');

    component.filter = { surgeryRoomNumber: '123', date: '2024-12-28', staff: 'John', patient: 'Doe' };
    component.onFilterChange();

    expect(component.currentPage).toBe(1);
    expect(component.filterChange.emit).toHaveBeenCalledWith(component.filter);
  });

  it('should reset filters on resetFilters()', () => {
    component.filter = { surgeryRoomNumber: '123', date: '2024-12-28', staff: 'John', patient: 'Doe' };

    component.resetFilters();

    expect(component.filter).toEqual({
      surgeryRoomNumber: '',
      date: '',
      staff: '',
      patient: ''
    });
  });

  it('should return paginated appointments on getPaginatedAppointments()', () => {
    component.appointments = [
      { Id: '1', RequestCode: 'req1', SurgeryRoomNumber: 'or1', AppointmentNumber: 'ap1', AppointmentDate: { Start: '08:00', End: '09:00' }, AssignedStaff: ['D20241'] },
      { Id: '2', RequestCode: 'req2', SurgeryRoomNumber: 'or1', AppointmentNumber: 'ap2', AppointmentDate: { Start: '09:00', End: '10:00' }, AssignedStaff: ['D20241'] },
    ];
    component.itemsPerPage = 1;
    component.currentPage = 1;

    const paginatedAppointments = component.getPaginatedAppointments();

    expect(paginatedAppointments.length).toBe(1);
    expect(paginatedAppointments[0].Id).toBe('1');
  });

  it('should navigate to next page on nextPage()', () => {
    component.totalItems = 3;
    component.itemsPerPage = 1;
    component.currentPage = 1;

    component.nextPage();

    expect(component.currentPage).toBe(2);
  });

  it('should navigate to previous page on previousPage()', () => {
    component.currentPage = 2;

    component.previousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should update query params on updateQueryParams()', () => {
    component.filter = { surgeryRoomNumber: '123', date: '2024-12-28', staff: 'D20241', patient: '202412000001' };
    component.currentPage = 1;

    component.updateQueryParams();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/appointments'], {
      queryParams: {
        surgeryRoomNumber: '123',
        date: '2024-12-28',
        staff: 'D20241',
        patient: '202412000001',
        page: '1'
      }
    });
  });
});