import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientComponent } from './patient.component';
import {HttpResponse} from '@angular/common/http';
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

  it('should redirect to home if not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not a patient! Please login...'
    );
  });
});
