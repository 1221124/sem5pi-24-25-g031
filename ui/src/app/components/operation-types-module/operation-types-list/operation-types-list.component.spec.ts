import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationTypesListComponent } from './operation-types-list.component';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationType } from '../../../models/operation-type.model';

describe('OperationTypesListComponent', () => {
  let component: OperationTypesListComponent;
  let fixture: ComponentFixture<OperationTypesListComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'getToken', 'extractRoleFromAccessToken', 'updateMessage', 'updateIsError']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [OperationTypesListComponent],
      imports: [
        CommonModule,
        NgForOf,
        NgIf,
        FormsModule
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationTypesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home if user is not authenticated', async () => {
    authService.isAuthenticated.and.returnValue(false);
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should navigate to home if user is not an admin', async () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.extractRoleFromAccessToken.and.returnValue('user');
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should call onStatusToggle when status is toggled', () => {
    const operationType: OperationType = {
      Id: '1',
      OperationTypeCode: 'OP123',
      Name: 'Surgery',
      Specialization: 'Orthopedics',
      RequiredStaff: [
        {
          Role: 'Surgeon',
          Specialization: 'Orthopedics',
          Quantity: 1,
          IsRequiredInPreparation: true,
          IsRequiredInSurgery: true,
          IsRequiredInCleaning: false
        }
      ],
      PhasesDuration: {
        Preparation: 15,
        Surgery: 30,
        Cleaning: 10
      },
      Status: 'Active',
      Version: 1
    };

    const statusToggleEmitterSpy = spyOn(component.statusToggle, 'emit');
    component.onStatusToggle(operationType);
    expect(statusToggleEmitterSpy).toHaveBeenCalledWith(operationType);
  });

  it('should reset filters when resetFilters is called', () => {
    component.filter = { name: 'Surgery', specialization: 'Orthopedics', status: 'Active' };
    component.resetFilters();
    expect(component.filter).toEqual({ name: '', specialization: '', status: '' });
  });

  it('should call filterChange emitter when filter changes', () => {
    const filterChangeEmitterSpy = spyOn(component.filterChange, 'emit');
    component.filter = { name: 'Surgery', specialization: 'Orthopedics', status: 'Active' };
    component.onFilterChange();
    expect(filterChangeEmitterSpy).toHaveBeenCalledWith(component.filter);
  });

  it('should navigate with queryParams when filter changes', () => {
    const filter = { name: 'Surgery', specialization: 'Orthopedics', status: 'Active' };
    component.filter = filter;
    component.currentPage = 1;

    component.updateQueryParams();
    expect(router.navigate).toHaveBeenCalledWith(['/admin/operationTypes'], {
      queryParams: { name: 'Surgery', specialization: 'Orthopedics', status: 'Active', page: '1' }
    });
  });

  it('should paginate operation types correctly', () => {
    const operationTypes: OperationType[] = Array(15).fill(null).map((_, i) => ({
      Id: `${i}`,
      OperationTypeCode: `OP${i}`,
      Name: `Operation ${i}`,
      Specialization: `Specialization ${i}`,
      RequiredStaff: [{
        Role: 'Surgeon',
        Specialization: `Specialization ${i}`,
        Quantity: 1,
        IsRequiredInPreparation: true,
        IsRequiredInSurgery: true,
        IsRequiredInCleaning: false
      }],
      PhasesDuration: { Preparation: 10, Surgery: 20, Cleaning: 30 },
      Status: 'Active',
      Version: 1
    }));

    component.operationTypes = operationTypes;
    component.itemsPerPage = 5;
    component.currentPage = 2;

    const paginated = component.getPaginatedOperationTypes();
    expect(paginated.length).toBe(5);
    expect(paginated[0].Name).toBe('Operation 5');
  });

  it('should navigate to next page and update query params', () => {
    component.totalItems = 20;
    component.itemsPerPage = 5;
    component.currentPage = 1;
    component.nextPage();

    expect(component.currentPage).toBe(2);
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should navigate to previous page and update query params', () => {
    component.totalItems = 20;
    component.itemsPerPage = 5;
    component.currentPage = 2;
    component.previousPage();

    expect(component.currentPage).toBe(1);
    expect(router.navigate).toHaveBeenCalled();
  });
});