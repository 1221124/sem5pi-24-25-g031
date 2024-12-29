import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MedicalConditionEntryFormComponent } from './medical-condition-entry-form.component';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { AuthService } from '../../../services/auth/auth.service';
import { MedicalConditionService } from '../../../services/medical-condition/medical-condition.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const mockPatientMedicalRecordService = {
  saveMedicalCondition: jasmine.createSpy('saveMedicalCondition').and.returnValue(Promise.resolve({ status: 200 }))
};

const mockAuthService = {
  isAuthenticated: jasmine.createSpy('isAuthenticated').and.returnValue(true),
  getToken: jasmine.createSpy('getToken').and.returnValue('mock-token'),
  extractRoleFromAccessToken: jasmine.createSpy('extractRoleFromAccessToken').and.returnValue('doctor')
};

const mockMedicalConditionService = {
  validateICD11Code: jasmine.createSpy('validateICD11Code').and.returnValue(Promise.resolve(true))
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate')
};

describe('MedicalConditionEntryFormComponent', () => {
  let component: MedicalConditionEntryFormComponent;
  let fixture: ComponentFixture<MedicalConditionEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalConditionEntryFormComponent],
      imports: [CommonModule, FormsModule],
      providers: [
        { provide: PatientMedicalRecordService, useValue: mockPatientMedicalRecordService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MedicalConditionService, useValue: mockMedicalConditionService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MedicalConditionEntryFormComponent);
    component = fixture.componentInstance;

    component.patientMedicalRecord = {
      Id: 'mock-record-id',
      MedicalRecordNumber: '12345',
      Allergies: [],
      MedicalConditions: []
    };

    component.medicalCondition = {
      ICD11Code: 'A01',
      Date: new Date(),
      notMeaningfulAnymore: false
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize accessToken and role on ngOnInit', async () => {
    await component.ngOnInit();

    expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(mockAuthService.extractRoleFromAccessToken).toHaveBeenCalledWith('mock-token');
    expect(component.accessToken).toBe('mock-token');
    expect(component.isEdit).toBeTrue();
    expect(component.newMedicalCondition).toEqual(component.medicalCondition);
  });

  it('should navigate away if user is not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should save medical condition successfully', async () => {
    await component.saveMedicalCondition();

    expect(mockPatientMedicalRecordService.saveMedicalCondition).toHaveBeenCalledWith(
      'mock-record-id',
      component.newMedicalCondition,
      'mock-token'
    );
    expect(component.message).toBe('Medical condition saved successfully');
    expect(component.isError).toBeFalse();
  });

  it('should handle error when saving medical condition fails', async () => {
    mockPatientMedicalRecordService.saveMedicalCondition.and.returnValue(Promise.reject());

    await component.saveMedicalCondition();

    expect(component.message).toBe('Error saving medical condition');
    expect(component.isError).toBeTrue();
  });

  it('should validate ICD11 code successfully', async () => {
    await component.validateICD11Code('A01');

    expect(mockMedicalConditionService.validateICD11Code).toHaveBeenCalledWith('A01', 'mock-token');
    expect(component.message).toBe('ICD11 code is valid');
    expect(component.isError).toBeFalse();
  });

  it('should handle error when ICD11 code validation fails', async () => {
    mockMedicalConditionService.validateICD11Code.and.returnValue(Promise.resolve(false));

    await component.validateICD11Code('A01');

    expect(component.message).toBe('ICD11 code is invalid');
    expect(component.isError).toBeTrue();
  });

  it('should handle empty ICD11 code validation', async () => {
    await component.validateICD11Code('');

    expect(component.message).toBe('ICD11 code cannot be empty');
    expect(component.isError).toBeTrue();
  });
});