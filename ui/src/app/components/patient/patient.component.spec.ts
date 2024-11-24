import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientComponent } from './patient.component';
import {HttpResponse, provideHttpClient, withFetch} from '@angular/common/http';
import {PatientService} from '../../services/patient/patient.service';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

describe('PatientComponent', () => {
  let component: PatientComponent;
  let fixture: ComponentFixture<PatientComponent>;
  let mockPatientService: jasmine.SpyObj<PatientService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;


  beforeEach(async () => {
    mockPatientService = jasmine.createSpyObj('PatientService', [
      'update',
      'getByEmail',
      'deletePatient'
    ]);

    mockPatientService.update.and.returnValue(Promise.resolve(new HttpResponse({status:200}) ));
    mockPatientService.getByEmail.and.returnValue(Promise.resolve({ status: 200, body: { patient: { Id: null, FullName: { FirstName: null, LastName: null }, DateOfBirth: null, Gender: null, MedicalRecordNumber: null, ContactInformation: { Email: null, PhoneNumber: null }, MedicalCondition: null, EmergencyContact: null, AppointmentHistory: null, UserId: null }}}));
    mockPatientService.deletePatient.and.returnValue(Promise.resolve(new HttpResponse({status:200}) ));

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'updateMessage',
      'updateIsError'
    ]);

    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.stub();

    await TestBed.configureTestingModule({
      imports: [PatientComponent, CommonModule, FormsModule],
      providers: [
        { provide: PatientService, useValue: mockPatientService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  describe('updateField', () => {
    it('should update the email field and close the modal', async () => {
      component.patient.ContactInformation.Email = 'old@example.com';
      component.tempEmail = 'new@example.com';

      await component.updateField('email');

      expect(mockPatientService.update).toHaveBeenCalledWith(
        jasmine.objectContaining({
          ContactInformation: jasmine.objectContaining({Email: 'new@example.com'})
        }),
        'old@example.com',
        'mockToken'
      );
      expect(component.message).toBe('Patient information updated successfully!');
      expect(component.showModal).toBeFalse();
    });
    it('should update the phoneNumber field and close the modal', async () => {
      component.patient.ContactInformation.PhoneNumber = 123456789;
      component.tempPhoneNumber = '987654321';

      await component.updateField('phoneNumber');

      expect(mockPatientService.update).toHaveBeenCalledWith(
        jasmine.objectContaining({
          ContactInformation: jasmine.objectContaining({ PhoneNumber: 987654321 })
        }),
        component.oldEmail,
        'mockToken'
      );
      expect(component.message).toBe('Patient information updated successfully!');
      expect(component.showModal).toBeFalse();
    });
  });

  describe('delete', () => {
    it('should delete a patient successfully', async () => {
      await component.delete('patient-id');

      expect(mockPatientService.deletePatient).toHaveBeenCalledWith('patient-id', 'mockToken');
      expect(component.message).toBe('Patient deleted successfully!');
      expect(component.success).toBeTrue();
    });
  });


  it('should create', ()=> {
    expect(component).toBeTruthy();
  });

  describe('authorization', () => {
    it('should redirect to home if not authenticated', (async () => {
      mockAuthService.isAuthenticated.and.returnValue(false);

      await component.ngOnInit();

      expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
        'You are not authenticated or are not a patient! Please login...'
      );
    }));

  });
  it('should handle unauthorized error during deletion', async () => {
    mockPatientService.deletePatient.and.returnValue(
      Promise.reject({status: 401})
    );

    await component.delete('patient-id');

    expect(mockPatientService.deletePatient).toHaveBeenCalledWith('patient-id', 'mockToken');
    expect(component.message).toBe('You are not authorized to delete patients! Please log in...');
  });

  it('should fetch patient by email', async () => {
    mockPatientService.getByEmail.and.returnValue(
      Promise.resolve({
        status: 200,
        body: {
          patient: {
            Id: '123',
            FullName: { FirstName: 'John', LastName: 'Doe' },
            ContactInformation: { Email: 'john.doe@example.com', PhoneNumber: 123456789 },
            MedicalCondition: [],
            EmergencyContact: 987654321,
            AppointmentHistory: [],
            DateOfBirth: new Date(),
            Gender: 'Male',
            MedicalRecordNumber: 'MRN001',
            UserId: 'user-id'
          }
        }
      })
    );

    await component.getPatientByEmail('john.doe@example.com');

    expect(component.patient.FullName.FirstName).toBe('John');
    expect(component.patient.ContactInformation.Email).toBe('john.doe@example.com');
  });

});
