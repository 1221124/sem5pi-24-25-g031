import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { OperationTypesComponent } from './operation-types.component';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { AuthService } from '../../../services/auth/auth.service';
import { EnumsService } from '../../../services/enums/enums.service';
import { of } from 'rxjs';
import { OperationType } from '../../../models/operation-type.model';

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;
  let mockOperationTypesService: jasmine.SpyObj<OperationTypesService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockEnumsService: jasmine.SpyObj<EnumsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockOperationTypesService = jasmine.createSpyObj('OperationTypesService', ['getOperationTypes']);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getToken',
      'updateMessage',
      'updateIsError',
      'extractRoleFromAccessToken',
    ]);
    mockEnumsService = jasmine.createSpyObj('EnumsService', [
      'getStaffRoles',
      'getSpecializations',
      'getStatuses',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', ['queryParams']);
    mockActivatedRoute.queryParams = of({
      name: '',
      specialization: '',
      status: '',
      page: '1',
    });

    await TestBed.configureTestingModule({
      imports: [OperationTypesComponent],
      providers: [
        { provide: OperationTypesService, useValue: mockOperationTypesService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: EnumsService, useValue: mockEnumsService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(OperationTypesComponent);
    component = fixture.componentInstance;

    mockAuthService.isAuthenticated.and.returnValue(true);
    mockAuthService.getToken.and.returnValue('mockToken');
    mockAuthService.extractRoleFromAccessToken.and.returnValue('admin');
    mockEnumsService.getStaffRoles.and.returnValue(Promise.resolve(['Doctor', 'Nurse']));
    mockEnumsService.getSpecializations.and.returnValue(Promise.resolve(['Cardiology', 'Neurology']));
    mockEnumsService.getStatuses.and.returnValue(Promise.resolve(['Active', 'Inactive']));

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect to login if the user is not authenticated', async () => {
    mockAuthService.isAuthenticated.and.returnValue(false);

    await component.ngOnInit();

    expect(mockAuthService.updateMessage).toHaveBeenCalledWith(
      'You are not authenticated or are not an admin! Please login...'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  });

  it('should load roles, specializations, and statuses on initialization', async () => {
    await component.ngOnInit();

    expect(component.roles).toEqual(['Doctor', 'Nurse']);
    expect(component.specializations).toEqual(['Cardiology', 'Neurology']);
    expect(component.statuses).toEqual(['Active', 'Inactive']);
  });

  it('should load operation types and initialize the list', async () => {
    const mockOperationTypes: OperationType[] = [
      {
        Id: '1',
        OperationTypeCode: 'OT001',
        Name: 'Heart Surgery',
        Specialization: 'Cardiology',
        RequiredStaff: [
          {
            Role: 'Doctor',
            Specialization: 'Cardiologist',
            Quantity: 2,
            IsRequiredInPreparation: true,
            IsRequiredInSurgery: true,
            IsRequiredInCleaning: false,
          },
          {
            Role: 'Nurse',
            Specialization: 'General',
            Quantity: 1,
            IsRequiredInPreparation: false,
            IsRequiredInSurgery: true,
            IsRequiredInCleaning: true,
          },
        ],
        PhasesDuration: {
          Preparation: 30,
          Surgery: 120,
          Cleaning: 20,
        },
        Status: 'Active',
        Version: 1,
      },
    ];
    mockOperationTypesService.getOperationTypes.and.returnValue(
      Promise.resolve({ status: 200, body: { operationTypes: mockOperationTypes, totalItems: 1 } })
    );

    await component.ngOnInit();

    expect(component.operationTypes).toEqual(mockOperationTypes);
    expect(component.totalItems).toBe(1);
  });

  it('should handle errors when loading operation types', async () => {
    mockOperationTypesService.getOperationTypes.and.returnValue(Promise.reject({ status: 404 }));

    await component.loadOperationTypes();

    expect(component.operationTypes).toEqual([]);
    expect(component.totalItems).toBe(0);
  });

  it('should navigate to form view on showOperationTypesForm call', async () => {
    component.selectedOperationType = null;

    await component.showOperationTypesForm();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/operationTypes/create']);
  });

  it('should navigate to update view if an operation type is selected', async () => {
    component.selectedOperationType = { OperationTypeCode: '1', Name: 'Test', Status: 'Active' } as any;

    await component.showOperationTypesForm();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/operationTypes/update'], {
      queryParams: { code: '1' },
    });
  });

  it('should reset filters and reload operation types when showing the list', async () => {
    component.filter = { name: 'test', specialization: 'Cardiology', status: 'Active' };

    await component.showOperationTypesList();

    expect(component.filter).toEqual({ name: '', specialization: '', status: '' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/operationTypes'], { queryParams: { page: 1 } });
  });
});