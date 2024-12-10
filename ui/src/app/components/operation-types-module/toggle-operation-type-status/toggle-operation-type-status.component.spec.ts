import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleOperationTypeStatusComponent } from './toggle-operation-type-status.component';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

describe('ToggleOperationTypeStatusComponent', () => {
  let component: ToggleOperationTypeStatusComponent;
  let fixture: ComponentFixture<ToggleOperationTypeStatusComponent>;
  let mockService: jasmine.SpyObj<OperationTypesService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('OperationTypesService', ['updateOperationType', 'deleteOperationType']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken', 'extractRoleFromAccessToken']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ToggleOperationTypeStatusComponent],
      providers: [
        { provide: OperationTypesService, useValue: mockService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    });

    fixture = TestBed.createComponent(ToggleOperationTypeStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should redirect if not authenticated', async () => {
      mockAuthService.isAuthenticated.and.returnValue(false);

      await component.ngOnInit();

      expect(mockAuthService.updateMessage).toHaveBeenCalledWith('You are not authenticated or are not an admin! Please login...');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('should redirect if not an admin', async () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockAuthService.extractRoleFromAccessToken.and.returnValue('user');

      await component.ngOnInit();

      expect(mockAuthService.updateMessage).toHaveBeenCalledWith('You are not authenticated or are not an admin! Redirecting to login...');
      expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
    });

    it('should initialize correctly if authenticated and admin', async () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockAuthService.extractRoleFromAccessToken.and.returnValue('admin');

      await component.ngOnInit();

      expect(component.accessToken).toBeTruthy();
    });
  });

  describe('toggleStatus', () => {
    it('should deactivate operation type when status is active', async () => {
      component.operationType = { Id: '1', Status: 'Active', OperationTypeCode: '', Name: '', Specialization: '', RequiredStaff: [], PhasesDuration: { Preparation: 0, Surgery: 0, Cleaning: 0 }, Version: 1 };

      mockService.deleteOperationType.and.returnValue(Promise.resolve(new HttpResponse  ({ status: 200 })));

      await component.toggleStatus();

      expect(mockService.deleteOperationType).toHaveBeenCalledWith('1', component.accessToken);
      expect(component.statusToggled.emit).toHaveBeenCalled();
    });

    it('should activate operation type when status is not active', async () => {
      component.operationType = { Id: '1', Status: 'Inactive', OperationTypeCode: '', Name: '', Specialization: '', RequiredStaff: [], PhasesDuration: { Preparation: 0, Surgery: 0, Cleaning: 0 }, Version: 1 };

      mockService.updateOperationType.and.returnValue(Promise.resolve(new HttpResponse  ({ status: 200 })));

      await component.toggleStatus();

      expect(mockService.updateOperationType).toHaveBeenCalledWith('1', { ...component.operationType, Status: 'Active' }, component.accessToken);
      expect(component.statusToggled.emit).toHaveBeenCalled();
    });

    it('should handle error in toggle status', async () => {
      component.operationType = { Id: '1', Status: 'Active', OperationTypeCode: '', Name: '', Specialization: '', RequiredStaff: [], PhasesDuration: { Preparation: 0, Surgery: 0, Cleaning: 0 }, Version: 1 };

      mockService.deleteOperationType.and.returnValue(Promise.reject('Error'));

      await component.toggleStatus();

      expect(console.error).toHaveBeenCalledWith('Error toggling status:', 'Error');
    });
  });

  describe('onCancel', () => {
    it('should emit cancel event', () => {
      spyOn(component.cancel, 'emit');

      component.onCancel();

      expect(component.cancel.emit).toHaveBeenCalled();
    });
  });
});