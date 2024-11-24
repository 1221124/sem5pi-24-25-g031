import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPatientsComponent } from './admin-patients.component';
import {HttpClient, HttpErrorResponse, provideHttpClient, withFetch} from '@angular/common/http';
import {PatientService} from '../../services/patient/patient.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {PatientsService} from '../../services/admin-patients/admin-patients.service';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {of, throwError} from 'rxjs';

describe('AdminPatientsComponent', () => {
  let component: AdminPatientsComponent;
  let fixture: ComponentFixture<AdminPatientsComponent>;
  let mockPatientService: jasmine.SpyObj<PatientsService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', [
      'getPatients',
      'getFilterPatients',
      'updatePatient',
      'deletePatient',
      'post'
    ]);

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'updateMessage',
      'updateIsError'
    ]);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, AdminPatientsComponent],
      providers: [
        {provide: PatientsService, useValue: mockPatientService},
        {provide: AuthService, useValue: mockAuthService},
        provideHttpClient(withFetch())
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if not authenticated', () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith('You are not authenticated or are not an admin! Please login...');
    expect(mockAuthService.updateIsError).toHaveBeenCalledWith(true);
  });

  it('should fetch patients if authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');
    mockAuthService.extractRoleFromAccessToken = jasmine.createSpy().and.returnValue('admin');

    const mockPatients = [
      { id: '1', fullName: { firstName: 'John', lastName: 'Doe' }, appointmentHistory: [] },
      { id: '2', fullName: { firstName: 'Jane', lastName: 'Smith' }, appointmentHistory: [] }
    ];
    mockPatientService.getPatients.and.returnValue(of(mockPatients));

    await component.ngOnInit();

    expect(component.patients).toEqual(mockPatients);
    expect(mockPatientService.getPatients).toHaveBeenCalledTimes(1);
    expect(mockAuthService.extractRoleFromAccessToken).toHaveBeenCalledWith('mockToken');
  });

  it('should fetch patients from the service', async () => {
    const mockPatients = [
      { id: '1', fullName: { firstName: 'John', lastName: 'Doe' }, appointmentHistory: [] },
      { id: '2', fullName: { firstName: 'Jane', lastName: 'Smith' }, appointmentHistory: [] }
    ];
    mockPatientService.getPatients.and.returnValue(of(mockPatients));

    await component.fetchPatients();

    expect(component.patients).toEqual(mockPatients);
    expect(mockPatientService.getPatients).toHaveBeenCalledTimes(1);
  });

  it('should apply filters and fetch filtered patients', async () => {
    const mockFilteredPatients = [
      { id: '3', fullName: { firstName: 'Filtered', lastName: 'Patient' }, appointmentHistory: [] }
    ];
    mockPatientService.getFilterPatients.and.returnValue(of(mockFilteredPatients));

    component.filter.fullName = 'Filtered Patient';
    await component.applyFilter();

    expect(component.patients).toEqual(mockFilteredPatients);
    expect(mockPatientService.getFilterPatients).toHaveBeenCalledWith(component.filter, '');
  });

  it('should delete a patient and refresh the list', async () => {
    const mockPatient = { id: '1', fullName: { firstName: 'John', lastName: 'Doe' } };
    mockPatientService.deletePatient.and.returnValue(of(null));
    spyOn(component, 'refreshPatients');

    component.deletePatient(mockPatient);

    expect(mockPatientService.deletePatient).toHaveBeenCalledWith(mockPatient.id, '');
    expect(component.refreshPatients).toHaveBeenCalled();
  });

  it('should create a new patient and refresh the list', () => {
    mockPatientService.post.and.returnValue(of(null).subscribe());
    spyOn(component, 'refreshPatients');

    component.firstName = 'John';
    component.lastName = 'Doe';
    component.email = 'john.doe@example.com';
    component.dateOfBirth = new Date('1990-01-01');
    component.phoneNumber = '123456789';
    component.gender = 'Male';

    component.createPatient();

    expect(mockPatientService.post).toHaveBeenCalledWith(
      'John',
      'Doe',
      new Date('1990-01-01'),
      'john.doe@example.com',
      '123456789',
      'Male',
      ''
    );
    expect(component.refreshPatients).toHaveBeenCalled();
  });

  it('should clear all filters and fetch patients', async () => {
    spyOn(component, 'fetchPatients');
    component.filter = {
      pageNumber: 2,
      fullName: 'Test',
      email: 'test@example.com',
      phoneNumber: '123456789',
      medicalRecordNumber: 'MR123',
      dateOfBirth: '2000-01-01',
      gender: 'Male'
    };

    component.clearFilters();

    expect(component.filter).toEqual({
      pageNumber: 1,
      fullName: '',
      email: '',
      phoneNumber: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: ''
    });
    expect(component.fetchPatients).toHaveBeenCalled();
  });

  it('should add a new slot if no empty slot exists', () => {
    component.selectedPatient = { appointmentHistory: [] };

    component.addSlot();

    expect(component.selectedPatient.appointmentHistory.length).toBe(1);
    expect(component.selectedPatient.appointmentHistory[0]).toEqual({ start: '', end: '' });
  });

  it('should not add a new slot if an empty slot already exists', () => {
    component.selectedPatient = {
      appointmentHistory: [{ start: '', end: '' }]
    };

    component.addSlot();

    expect(component.selectedPatient.appointmentHistory.length).toBe(1);
  });

  it('should add a new slot to the selected patient', () => {
    component.selectedPatient = { appointmentHistory: [] };
    component.newSlotStart = '2024-01-01T08:00:00';
    component.newSlotEnd = '2024-01-01T09:00:00';

    component.addNewSlot();

    expect(component.selectedPatient.appointmentHistory.length).toBe(1);
    expect(component.selectedPatient.appointmentHistory[0]).toEqual({
      start: '2024-01-01T08:00:00',
      end: '2024-01-01T09:00:00'
    });
    expect(component.newSlotStart).toBe('');
    expect(component.newSlotEnd).toBe('');
    expect(component.isAddSlotFormVisible).toBeFalse();
  });

  it('should show an alert if start or end date is missing', () => {
    spyOn(window, 'alert');

    component.newSlotStart = '';
    component.newSlotEnd = '2024-01-01T09:00:00';

    component.addNewSlot();

    expect(window.alert).toHaveBeenCalledWith('Please select both start and end dates for the slot.');
    expect(component.selectedPatient.appointmentHistory).toBeUndefined();
  });

  it('should set selectedPatient and open edit modal', () => {
    const mockPatient = {
      contactInformation: { email: 'test@example.com', phoneNumber: '123456789' },
      fullName: { firstName: 'John', lastName: 'Doe' },
      appointmentHistory: [
        { start: '2023-01-01T08:00:00', end: '2023-01-01T09:00:00' }
      ]
    };

    component.editPatient(mockPatient);

    expect(component.selectedPatient).toEqual({
      emailId: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      email: 'test@example.com',
      phoneNumber: '123456789',
      emergencyContact: { number: { value: '' } },
      appointmentHistory: [
        { start: new Date('2023-01-01T08:00:00'), end: new Date('2023-01-01T09:00:00') }
      ]
    });
    expect(component.isEditModalOpen).toBeTrue();
    expect(component.isCreateModalOpen).toBeFalse();
    expect(component.isAppoitmentHistoryModalOpen).toBeFalse();
  });

  it('should reset selectedPatient and open create patient modal', () => {
    component.selectedPatient = { fullName: 'Existing Patient' };
    component.isEditModalOpen = true;

    component.openCreatePatientModal();

    expect(component.selectedPatient).toBeNull();
    expect(component.isCreateModalOpen).toBeTrue();
    expect(component.isEditModalOpen).toBeFalse();
    expect(component.isAppoitmentHistoryModalOpen).toBeFalse();
  });

  it('should set selectedPatient and open appointment history modal', () => {
    const mockPatient = {
      appointmentHistory: [
        { start: '2023-01-01T08:00:00', end: '2023-01-01T09:00:00' }
      ]
    };

    component.openAppointmentHistoryModal(mockPatient);

    expect(component.selectedPatient).toEqual({
      appointmentHistory: mockPatient.appointmentHistory
    });
    expect(component.isAppoitmentHistoryModalOpen).toBeTrue();
    expect(component.isEditModalOpen).toBeFalse();
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('should close appointment history modal', () => {
    component.isAppoitmentHistoryModalOpen = true;

    component.closeAppointmentHistoryModal();

    expect(component.isAppoitmentHistoryModalOpen).toBeFalse();
  });

  it('should close delete modal and reset selectedPatient', () => {
    component.isDeleteModalOpen = true;
    component.selectedPatient = { id: '1' };

    component.closeDeleteModal();

    expect(component.isDeleteModalOpen).toBeFalse();
    expect(component.selectedPatient).toBeNull();
  });

  it('should validate email correctly', () => {
    expect(component.isValidEmail('test@example.com')).toBeTrue();
    expect(component.isValidEmail('invalid-email')).toBeFalse();
  });

  it('should validate phone number (always true as per implementation)', () => {
    expect(component.isValidPhoneNumber('123456789')).toBeTrue();
    expect(component.isValidPhoneNumber('')).toBeTrue();
  });

  it('should validate date correctly', () => {
    expect(component.isValidDate(new Date())).toBeTrue();
    expect(component.isValidDate('2023-01-01')).toBeTrue();
    expect(component.isValidDate('invalid-date')).toBeFalse();
  });

  it('should open create patient modal', () => {
    component.selectedPatient = { id: '1' };
    component.isEditModalOpen = true;

    component.openCreatePatientModal();

    expect(component.selectedPatient).toBeNull();
    expect(component.isCreateModalOpen).toBeTrue();
    expect(component.isEditModalOpen).toBeFalse();
    expect(component.isAppoitmentHistoryModalOpen).toBeFalse();
  });

  it('should close create patient modal', () => {
    component.isCreateModalOpen = true;

    component.closeCreatePatientModal();

    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('should open appointment history modal', () => {
    const mockPatient = {
      appointmentHistory: [{ start: '2023-01-01T08:00:00', end: '2023-01-01T09:00:00' }]
    };

    component.openAppointmentHistoryModal(mockPatient);

    expect(component.selectedPatient.appointmentHistory).toEqual(mockPatient.appointmentHistory);
    expect(component.isAppoitmentHistoryModalOpen).toBeTrue();
    expect(component.isEditModalOpen).toBeFalse();
    expect(component.isCreateModalOpen).toBeFalse();
  });

  it('should close appointment history modal', () => {
    component.isAppoitmentHistoryModalOpen = true;

    component.closeAppointmentHistoryModal();

    expect(component.isAppoitmentHistoryModalOpen).toBeFalse();
  });

  it('should confirm delete patient and open delete modal', () => {
    const mockPatient = { id: '1' };

    component.confirmDeletePatient(mockPatient);

    expect(component.isDeleteModalOpen).toBeTrue();
    expect(component.selectedPatient).toEqual(mockPatient);
  });

  it('should close delete modal and reset selected patient', () => {
    component.isDeleteModalOpen = true;
    component.selectedPatient = { id: '1' };

    component.closeDeleteModal();

    expect(component.isDeleteModalOpen).toBeFalse();
    expect(component.selectedPatient).toBeNull();
  });

  it('should handle errors in refreshPatients', async () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    mockPatientService.getFilterPatients.and.returnValue(throwError(() => errorResponse));

    await component.refreshPatients();

    expect(component.patients).toEqual([]);
  });

  it('should handle errors in fetchPatients', async () => {
    const errorResponse = new HttpErrorResponse({ status: 500, statusText: 'Server Error' });
    mockPatientService.getPatients.and.returnValue(throwError(() => errorResponse));

    await component.fetchPatients();

    expect(component.patients).toEqual([]);
  });

  it('should add a slot when appointmentHistory is null', () => {
    component.selectedPatient = { appointmentHistory: null };

    component.addSlot();

    expect(component.selectedPatient.appointmentHistory).toEqual([{ start: '', end: '' }]);
  });

  it('should not add a slot if an empty slot already exists', () => {
    component.selectedPatient = {
      appointmentHistory: [{ start: '', end: '' }]
    };

    component.addSlot();

    expect(component.selectedPatient.appointmentHistory.length).toBe(1);
  });

  it('should show an alert when trying to add a new slot with missing fields', () => {
    spyOn(window, 'alert');

    component.newSlotStart = '';
    component.newSlotEnd = '2023-01-01T09:00:00';

    component.addNewSlot();

    expect(window.alert).toHaveBeenCalledWith('Please select both start and end dates for the slot.');
    expect(component.selectedPatient.appointmentHistory).toBeUndefined();
  });

});
