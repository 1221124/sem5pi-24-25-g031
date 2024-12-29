import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PatientMedicalRecordComponent } from './patient-medical-record.component';
import { AuthService } from '../../../services/auth/auth.service';
import { PatientMedicalRecordService } from '../../../services/patient-medical-record/patient-medical-record.service';
import { MedicalConditionService } from '../../../services/medical-condition/medical-condition.service';
import { AllergyService } from '../../../services/allergy/allergy.service';

describe('PatientMedicalRecordComponent', () => {
  let component: PatientMedicalRecordComponent;
  let fixture: ComponentFixture<PatientMedicalRecordComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPatientMedicalRecordService: jasmine.SpyObj<PatientMedicalRecordService>;
  let mockMedicalConditionService: jasmine.SpyObj<MedicalConditionService>;
  let mockAllergyService: jasmine.SpyObj<AllergyService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'extractRoleFromAccessToken',
      'updateMessage',
      'updateIsError',
    ]);

    mockPatientMedicalRecordService = jasmine.createSpyObj('PatientMedicalRecordService', ['getPatientMedicalRecord']);
    mockMedicalConditionService = jasmine.createSpyObj('MedicalConditionService', ['get']);
    mockAllergyService = jasmine.createSpyObj('AllergyService', ['get']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [PatientMedicalRecordComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PatientMedicalRecordService, useValue: mockPatientMedicalRecordService },
        { provide: MedicalConditionService, useValue: mockMedicalConditionService },
        { provide: AllergyService, useValue: mockAllergyService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PatientMedicalRecordComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect to login if the user is not authenticated', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);

      component.ngOnInit();

      expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
        'You are not authenticated or are not an admin, a doctor, or a patient! Please login...'
      );
      expect(mockAuthService.updateIsError).toHaveBeenCalledWith(true);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('should fetch medical conditions, allergies, and patient record if authenticated', fakeAsync(() => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockAuthService.getToken.and.returnValue('mock-token');
      mockAuthService.extractRoleFromAccessToken.and.returnValue('admin');

      mockMedicalConditionService.get.and.returnValue(
        Promise.resolve({ status: 200, body: [{ id: '1', code: 'A01', name: 'Condition', description: 'Description', commonSymptoms: [] }] })
      );
      mockAllergyService.get.and.returnValue(
        Promise.resolve({ status: 200, body: [{ id: '1', code: 'B01', name: 'Allergy', description: 'Description' }] })
      );
      mockPatientMedicalRecordService.getPatientMedicalRecord.and.returnValue(
        Promise.resolve({
          status: 200,
          body: {
            patientMedicalRecord: {
              Id: '1',
              MedicalRecordNumber: 'MR123',
              Allergies: [],
              MedicalConditions: [],
            },
          },
        })
      );

      component.ngOnInit();
      tick();

      expect(component.allMedicalConditions.length).toBe(1);
      expect(component.allMedicalConditions[0].name).toBe('Condition 1');
      expect(component.allAlergies.length).toBe(1);
      expect(component.allAlergies[0].name).toBe('Allergy 1');
      expect(component.patientMedicalRecord.Id).toBe('1');
      expect(component.medicalRecordLoaded).toBeTrue();
    }));
  });

  describe('getMedicalConditionName', () => {
    it('should return the name of a medical condition by its code', () => {
      component.allMedicalConditions = [
        { id: '1', code: 'A01', name: 'Condition 1', description: 'Description', commonSymptoms: [] },
      ];

      const name = component.getMedicalConditionName('A01');

      expect(name).toBe('Condition 1');
    });

    it('should return "Unknown" if the medical condition is not found', () => {
      const name = component.getMedicalConditionName('A02');

      expect(name).toBe('Unknown');
    });
  });

  describe('getAllergyName', () => {
    it('should return the name of an allergy by its code', () => {
      component.allAlergies = [
        { id: '1', code: 'B01', name: 'Allergy 1', description: 'Description' },
      ];

      const name = component.getAllergyName('B01');

      expect(name).toBe('Allergy 1');
    });

    it('should return "Unknown" if the allergy is not found', () => {
      const name = component.getAllergyName('B02');

      expect(name).toBe('Unknown');
    });
  });

  describe('searchMedicalConditions', () => {
    it('should filter medical conditions by the search query', () => {
      component.patientMedicalRecord.MedicalConditions = [
        { ICD11Code: 'A01', Date: new Date(), notMeaningfulAnymore: false },
        { ICD11Code: 'A02', Date: new Date(), notMeaningfulAnymore: false },
      ];

      component.allMedicalConditions = [
        { id: '1', code: 'A01', name: 'Condition 1', description: 'Description', commonSymptoms: [] },
        { id: '2', code: 'A02', name: 'Condition 2', description: 'Description', commonSymptoms: [] },
      ];

      component.searchQuery = 'Condition 1';
      component.searchMedicalConditions();

      expect(component.filteredMedicalConditions.length).toBe(1);
      expect(component.filteredMedicalConditions[0].ICD11Code).toBe('A01');
    });
  });

  describe('searchAllergies', () => {
    it('should filter allergies by the search query', () => {
      component.patientMedicalRecord.Allergies = [
        { ICD11Code: 'B01', Date: new Date(), notMeaningfulAnymore: false },
        { ICD11Code: 'B02', Date: new Date(), notMeaningfulAnymore: false },
      ];

      component.allAlergies = [
        { id: '1', code: 'B01', name: 'Allergy 1', description: 'Description' },
        { id: '2', code: 'B02', name: 'Allergy 2', description: 'Description' },
      ];

      component.searchQuery = 'Allergy 1';
      component.searchAllergies();

      expect(component.filteredAllergies.length).toBe(1);
      expect(component.filteredAllergies[0].ICD11Code).toBe('B01');
    });
  });

  describe('closePopup', () => {
    it('should navigate to doctor/patients and emit close event', () => {
      spyOn(component.close, 'emit');

      component.closePopup();

      expect(mockRouter.navigate).toHaveBeenCalledWith(['doctor/patients']);
      expect(component.close.emit).toHaveBeenCalled();
    });
  });
});