import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationTypesFormComponent } from './operation-types-form.component';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

describe('OperationTypesFormComponent', () => {
  let component: OperationTypesFormComponent;
  let fixture: ComponentFixture<OperationTypesFormComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let operationTypesService: jasmine.SpyObj<OperationTypesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken', 'extractRoleFromAccessToken', 'updateMessage', 'updateIsError']);
    operationTypesService = jasmine.createSpyObj('OperationTypesService', ['post', 'updateOperationType']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OperationTypesFormComponent],
      imports: [
        CommonModule,
        NgForOf,
        NgIf,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: OperationTypesService, useValue: operationTypesService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationTypesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize operation type when no input is provided', () => {
    component.ngOnInit();
    expect(component.operationType).toEqual({
      Id: '',
      OperationTypeCode: '',
      Name: '',
      Specialization: '',
      RequiredStaff: [],
      PhasesDuration: { Preparation: 0, Surgery: 0, Cleaning: 0 },
      Status: 'Active',
      Version: 1
    });
  });

  it('should call ensureNewStaffBlock and add new staff to RequiredStaff array', () => {
    component.operationType = {
      Id: '',
      OperationTypeCode: '',
      Name: '',
      Specialization: '',
      RequiredStaff: [],
      PhasesDuration: { Preparation: 0, Surgery: 0, Cleaning: 0 },
      Status: 'Active',
      Version: 1
    };
    component.newRequiredStaff = { Role: 'Nurse', Specialization: 'Surgical', Quantity: 2, IsRequiredInPreparation: true, IsRequiredInSurgery: true, IsRequiredInCleaning: false };

    component.ensureNewStaffBlock();
    expect(component.operationType!.RequiredStaff.length).toBe(1);
    expect(component.operationType!.RequiredStaff[0].Role).toBe('Nurse');
  });

  it('should call post service when submitting form for a new operation type', async () => {
    component.operationType = {
      Id: '',
      OperationTypeCode: '123',
      Name: 'Surgery',
      Specialization: 'Orthopedics',
      RequiredStaff: [],
      PhasesDuration: { Preparation: 10, Surgery: 30, Cleaning: 20 },
      Status: 'Active',
      Version: 1
    };
    operationTypesService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));
    await component.submitForm();
    expect(operationTypesService.post).toHaveBeenCalled();
  });

  it('should call updateOperationType service when submitting form for an existing operation type', async () => {
    component.operationType = {
      Id: '1',
      OperationTypeCode: '123',
      Name: 'Surgery',
      Specialization: 'Orthopedics',
      RequiredStaff: [],
      PhasesDuration: { Preparation: 10, Surgery: 30, Cleaning: 20 },
      Status: 'Active',
      Version: 1
    };
    operationTypesService.updateOperationType.and.returnValue(Promise.resolve(new HttpResponse({ status: 200 })));
    await component.submitForm();
    expect(operationTypesService.updateOperationType).toHaveBeenCalled();
  });

  it('should call cancel when cancel form is triggered', () => {
    const cancelEmitterSpy = spyOn(component.cancel, 'emit');
    component.cancelForm();
    expect(cancelEmitterSpy).toHaveBeenCalled();
  });

  it('should navigate to the home page if user is not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should navigate to login if user is not an admin', async () => {
    authService.extractRoleFromAccessToken.and.returnValue('user');
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});