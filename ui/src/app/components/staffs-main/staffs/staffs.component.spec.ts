import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { StaffsComponent } from './staffs.component';
import { StaffsService } from '../../services/staffs/staffs.service';
import { AuthService } from '../../services/auth/auth.service';
import {HttpResponse, provideHttpClient, withFetch} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {from} from 'rxjs';

describe('StaffsComponent', () => {
  let component: StaffsComponent;
  let fixture: ComponentFixture<StaffsComponent>;
  let mockStaffsService: jasmine.SpyObj<StaffsService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockStaffsService = jasmine.createSpyObj('StaffsService', [
      'getStaffRoles',
      'getSpecializations',
      'getStaff',
      'post',
      'update',
      'deleteStaff',
    ]);

    mockStaffsService.getStaffRoles.and.returnValue(Promise.resolve(['Doctor', 'Nurse']));
    mockStaffsService.getSpecializations.and.returnValue(Promise.resolve(['Cardiology', 'Neurology']));
    mockStaffsService.getStaff.and.returnValue(
      Promise.resolve({ status: 200, body: { staffs: [], totalItems: 0 } })
    );
    mockStaffsService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));
    mockStaffsService.update.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));
    mockStaffsService.deleteStaff.and.returnValue(Promise.resolve(new HttpResponse({ status: 200 })));


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
      imports: [CommonModule, FormsModule, StaffsComponent],
      providers: [
        { provide: StaffsService, useValue: mockStaffsService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withFetch())
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not an admin! Please login...'
    );
  });

  it('should fetch roles and specializations on init', async () => {
    mockAuthService.extractRoleFromAccessToken.and.returnValue('admin');
    await component.ngOnInit();
    expect(mockStaffsService.getStaffRoles).toHaveBeenCalled();
    expect(mockStaffsService.getSpecializations).toHaveBeenCalled();
  });

  it('should handle errors when fetching staffs', async () => {
    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');
    mockStaffsService.getStaff.and.returnValue(Promise.reject({ status: 404 }));

    await component.fetchStaffs();

    expect(component.message).toBe('No staffs found!');
    expect(component.success).toBeFalse();
    expect(component.staffs).toEqual([]);
  });

  it('should create a new staff on success', async () => {
    mockStaffsService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));

    await component.submitRequest();

    expect(mockStaffsService.post).toHaveBeenCalled();
    expect(component.message).toBe('Staff successfully created!');
    expect(component.success).toBeTrue();
  });

  it('should handle errors when creating a new staff', async () => {
    mockStaffsService.post.and.returnValue(Promise.reject({ status: 401 }));

    await component.submitRequest();

    expect(mockStaffsService.post).toHaveBeenCalled();
    expect(component.message).toBe('You are not authorized to create Staff! Please log in...');
    expect(component.success).toBeFalse();
  });

  it('should update an existing staff on success', async () => {
    mockStaffsService.post.and.returnValue(Promise.resolve(new HttpResponse({ status: 201 })));

    await component.submitRequest();

    expect(mockStaffsService.post).toHaveBeenCalled();
    expect(component.message).toBe('Staff successfully created!');
    expect(component.success).toBeTrue();
  });

  it('should handle errors when updating a staff', async () => {
    component.isEditMode = true;
    component.staff.Id = '1';
    mockStaffsService.update.and.returnValue(Promise.reject({ status: 401 }));

    await component.submitRequest();

    expect(component.message).toBe('You are not authorized to update Staffs! Please log in...');
    expect(component.success).toBeFalse();
  });

  it('should delete a staff on success', async () => {
    await component.inactivate('1');

    expect(mockStaffsService.deleteStaff).toHaveBeenCalled();
    expect(component.message).toBe('Staff successfully inactivated!');
    expect(component.success).toBeTrue();
  });

  it('should handle errors when deleting a staff', async () => {
    mockStaffsService.deleteStaff.and.returnValue(
      Promise.reject({ status: 401, error: { message: 'Unauthorized' } })
    );

    await component.inactivate('1');

    expect(component.message).toBe('You are not authorized to delete Staff! Please log in...');
    expect(component.success).toBeFalse();
  });

  it('should clear form fields on clearForm call', () => {
    component.clearForm();
    expect(component.staff.Id).toBe('');
    expect(component.staff.FullName.FirstName).toBe('');
    expect(component.staff.FullName.LastName).toBe('');

    expect(component.isEditMode).toBe(false);
  });

  it('should toggle modals correctly', () => {
    component.openModal();
    expect(component.isCreateModalOpen).toBeTrue();

    component.closeModal();
    expect(component.isCreateModalOpen).toBeFalse();
  });
});
