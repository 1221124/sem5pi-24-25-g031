import { TestBed, ComponentFixture, fakeAsync, tick, flush } from '@angular/core/testing';
import { OperationTypesComponent } from './operation-types.component';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';

describe('OperationTypesComponent', () => {
  let component: OperationTypesComponent;
  let fixture: ComponentFixture<OperationTypesComponent>;
  let operationTypesService: jasmine.SpyObj<OperationTypesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const operationTypesServiceSpy = jasmine.createSpyObj('OperationTypesService', [
      'getStaffRoles', 'getSpecializations', 'getStatuses', 'getOperationTypes', 'post', 'updateOperationType', 'deleteOperationType'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    operationTypesServiceSpy.getStaffRoles.and.returnValue(Promise.resolve(['Admin', 'Doctor', 'Nurse']));
    operationTypesServiceSpy.getSpecializations.and.returnValue(Promise.resolve(['Cardiology', 'Orthopedics']));
    operationTypesServiceSpy.getStatuses.and.returnValue(Promise.resolve(['Active', 'Inactive']));
    operationTypesServiceSpy.getOperationTypes.and.returnValue(Promise.resolve());

    await TestBed.configureTestingModule({
      imports: [FormsModule, OperationTypesComponent],
      providers: [
        { provide: HttpClient, useValue: jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']) },
        { provide: OperationTypesService, useValue: operationTypesServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationTypesComponent);
    component = fixture.componentInstance;
    operationTypesService = TestBed.inject(OperationTypesService) as jasmine.SpyObj<OperationTypesService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles, specializations, and statuses on init', async () => {
    const roles : string[] = ['Admin', 'Doctor', 'Nurse'];
    const specializations : string[] = ['Cardiology', 'Orthopedics'];
    const statuses : string[] = ['Active', 'Inactive'];
    
    await component.ngOnInit();
  
    expect(component.roles).toEqual(roles);
    expect(component.specializations).toEqual(specializations);
    expect(component.statuses).toEqual(statuses);
  });
  

  it('should apply filters and fetch filtered operation types', fakeAsync(() => {
    const filteredOperationTypes = [
      { Id: '1', Name: 'Operation A', Specialization: 'Surgery', RequiredStaff: [], PhasesDuration: { Preparation: 1, Surgery: 2, Cleaning: 3 }, Status: 'Active' },
    ];
    operationTypesService.getOperationTypes.and.returnValue(Promise.resolve({
      status: 200,
      body: { operationTypes: filteredOperationTypes, totalItems: 1 }
    }));

    component.filter.name = 'Operation A';
    component.applyFilter();
    flush();

    expect(component.operationTypes).toEqual(filteredOperationTypes);
  }));

  it('should add new staff to the required staff list', () => {
    component.newStaff = { Role: 'Doctor', Specialization: 'Surgery', Quantity: 2 };
    component.addStaff();

    expect(component.operationType.RequiredStaff.length).toBe(1);
    expect(component.operationType.RequiredStaff[0]).toEqual({ Role: 'Doctor', Specialization: 'Surgery', Quantity: 2 });
  });

  it('should toggle the create form and clear form when hiding', () => {
    component.showCreateForm = true;
    component.toggleForm();

    expect(component.showCreateForm).toBeFalse();
    expect(component.operationType.Name).toBe('');
    expect(component.operationType.RequiredStaff).toEqual([]);
  });

  it('should submit new operation type and display success message', fakeAsync(() => {
    component.isEditMode = false;
    const newOperationType = {
      Id: '',
      Name: 'New Operation',
      Specialization: 'Orthopedics',
      RequiredStaff: [{ Role: 'Doctor', Specialization: 'Surgery', Quantity: 2 }],
      PhasesDuration: { Preparation: 1, Surgery: 2, Cleaning: 3 },
      Status: 'Active'
    };
    operationTypesService.post.and.returnValue(Promise.resolve(new HttpResponse({
      status: 201
    })));

    spyOn(component, 'clearForm');
    spyOn<any>(component, 'showCreateForm');
    spyOn<any>(component, 'fetchOperationTypes');

    component.operationType = newOperationType;

    fixture.detectChanges();

    component.submitOperationType();
    flush();

    expect(component.message).toBe('Operation Type successfully created!');
    expect(component.success).toBeTrue();
  }));

  it('should update an existing operation type', fakeAsync(() => {
    const updatedOperationType = {
      Id: '1',
      Name: 'Updated Operation',
      Specialization: 'Orthopedics',
      RequiredStaff: [],
      PhasesDuration: { Preparation: 1, Surgery: 2, Cleaning: 3 },
      Status: 'Active'
    };
  
    operationTypesService.updateOperationType.and.returnValue(Promise.resolve(new HttpResponse({
      status: 200,
      body: {},
      statusText: 'OK'
    })));
  
    component.isEditMode = true;
    component.operationType = updatedOperationType;
  
    component.submitOperationType();
    flush();
  
    expect(operationTypesService.updateOperationType).toHaveBeenCalledWith('1', updatedOperationType);
  }));
  

  it('should delete operation type and refresh list', fakeAsync(() => {
    const idToDelete = '1';
    operationTypesService.deleteOperationType.and.returnValue(Promise.resolve(new HttpResponse({
      status: 200,
      body: {},
      statusText: 'OK',
    })));
    operationTypesService.getOperationTypes.and.returnValue(Promise.resolve({
      status: 200,
      body: { operationTypes: [], totalItems: 0 }
    }));

    component.inactivate(idToDelete);
    tick();

    expect(operationTypesService.deleteOperationType).toHaveBeenCalledWith(idToDelete);
    expect(component.message).toBe('Operation Type successfully deleted!');
    expect(component.success).toBeTrue();
  }));

  it('should navigate to the admin page', () => {
    component.goToAdmin();

    expect(router.navigate).toHaveBeenCalledWith(['/admin']);
  });
});