import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { OperationTypesComponent } from './operation-types.component';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { AuthService } from '../../services/auth/auth.service';
import { HttpResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;
  let mockOperationTypesService: jasmine.SpyObj<OperationTypesService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockOperationTypesService = jasmine.createSpyObj('OperationTypesService', [
      'getStaffRoles',
      'getSpecializations',
      'getStatuses',
      'getOperationTypes',
      'post',
      'updateOperationType',
      'deleteOperationType',
    ]);

    mockOperationTypesService.deleteOperationType.and.returnValue(Promise.resolve(new HttpResponse({ status: 200 })));
    mockOperationTypesService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));
    mockOperationTypesService.getOperationTypes.and.returnValue(
      Promise.resolve({ status: 200, body: { operationTypes: [], totalItems: 0 } })
    );
    mockOperationTypesService.getStaffRoles.and.returnValue(Promise.resolve(['Doctor', 'Nurse']));
    mockOperationTypesService.getSpecializations.and.returnValue(Promise.resolve(['Cardiology', 'Neurology']));
    mockOperationTypesService.getStatuses.and.returnValue(Promise.resolve(['Active', 'Inactive']));

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'updateMessage',
      'updateIsError',
      'extractRoleFromAccessToken'
    ]);

    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRouter.navigate.and.stub();

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, OperationTypesComponent],
      providers: [
        { provide: OperationTypesService, useValue: mockOperationTypesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to home if not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not an admin! Please login...'
    );
  });

  it('should initialize roles, specializations, and statuses on success', async () => {
    mockAuthService.extractRoleFromAccessToken.and.returnValue('admin');
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');
    mockOperationTypesService.getStaffRoles.and.returnValue(Promise.resolve(['Role1', 'Role2']));
    mockOperationTypesService.getSpecializations.and.returnValue(Promise.resolve(['Spec1', 'Spec2']));
    mockOperationTypesService.getStatuses.and.returnValue(Promise.resolve(['Active', 'Inactive']));
    mockOperationTypesService.getOperationTypes.and.returnValue(
      Promise.resolve({ status: 200, body: { operationTypes: [], totalItems: 0 } })
    );

    await component.ngOnInit();

    expect(component.roles).toEqual(['Role1', 'Role2']);
    expect(component.specializations).toEqual(['Spec1', 'Spec2']);
    expect(component.statuses).toEqual(['Active', 'Inactive']);
  });

  it('should handle errors when fetching operation types', async () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');
    mockOperationTypesService.getOperationTypes.and.returnValue(Promise.reject({ status: 404 }));

    await component.fetchOperationTypes();

    expect(component.message).toBe('No Operation Types found!');
    expect(component.success).toBeFalse();
    expect(component.operationTypes).toEqual([]);
  });

  it('should handle success when deleting an operation type', async () => {
    mockOperationTypesService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 200 })));
    spyOn(component, 'fetchOperationTypes');

    await component.inactivate('1');

    expect(component.message).toBe('Operation Type successfully deleted!');
    expect(component.success).toBeTrue();
    expect(component.fetchOperationTypes).toHaveBeenCalled();
  });

  it('should handle errors when deleting an operation type', async () => {
    mockOperationTypesService.deleteOperationType.and.returnValue(
      Promise.reject({ status: 401, error: { message: 'Unauthorized' } })
    );

    await component.inactivate('1');

    expect(component.message).toBe('You are not authorized to delete Operation Types! Please log in...');
    expect(component.success).toBeFalse();
  });

  it('should add staff to the RequiredStaff list', () => {
    component.newStaff = { Role: 'Doctor', Specialization: 'Cardiology', Quantity: 1 };
    component.addStaff();
    expect(component.operationType.RequiredStaff).toContain(
      jasmine.objectContaining({ Role: 'Doctor', Specialization: 'Cardiology', Quantity: 1 })
    );
  });

  it('should not add staff if fields are incomplete', () => {
    component.newStaff = { Role: '', Specialization: '', Quantity: 0 };
    component.addStaff();
    expect(component.operationType.RequiredStaff.length).toBe(0);
    expect(component.message).toBe('Please fill in all fields for the staff');
    expect(component.success).toBeFalse();
  });

  it('should toggle form visibility and clear the form', () => {
    spyOn(component, 'clearForm');
    component.toggleForm();
    expect(component.showCreateForm).toBeTrue();

    component.toggleForm();
    expect(component.clearForm).toHaveBeenCalled();
    expect(component.showCreateForm).toBeFalse();
  });

  it('should submit a new operation type on success', async () => {
    mockOperationTypesService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));

    await component.submitOperationType();

    expect(mockOperationTypesService.post).toHaveBeenCalled();
    expect(component.message).toBe('Operation Type successfully created!');
    expect(component.success).toBeTrue();
  });

  it('should handle errors when submitting a new operation type', async () => {
    mockOperationTypesService.post.and.returnValue(
      Promise.reject({ status: 401, error: { message: 'Unauthorized' } })
    );

    await component.submitOperationType();

    expect(component.message).toBe('You are not authorized to create Operation Types! Please log in...');
    expect(component.success).toBeFalse();
  });

});
