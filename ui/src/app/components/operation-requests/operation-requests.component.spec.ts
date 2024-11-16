import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OperationRequestsComponent } from './operation-requests.component';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';
import { StaffsService } from '../../services/staffs/staffs.service';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { PatientsService } from '../../services/admin-patients/admin-patients.service';

describe('OperationRequestsComponent', () => {
  let component: OperationRequestsComponent;
  let fixture: ComponentFixture<OperationRequestsComponent>;
  let operationRequestsService: jasmine.SpyObj<OperationRequestsService>;
  let staffsService: jasmine.SpyObj<StaffsService>;
  let patientsService: jasmine.SpyObj<PatientsService>;
  let operationTypesService: jasmine.SpyObj<OperationTypesService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const operationRequestsServiceSpy = jasmine.createSpyObj('OperationRequestsService', ['loadOperationRequests']);
    const staffsServiceSpy = jasmine.createSpyObj('StaffsService', ['loadStaffs']);
    const patientsServiceSpy = jasmine.createSpyObj('PatientsService', ['loadPatients']);
    const operationTypesServiceSpy = jasmine.createSpyObj('OperationTypesService', ['loadOperationTypes', 'loadPriority']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    operationRequestsServiceSpy.loadOperationRequests.and.returnValue(Promise.resolve(['Request1', 'Request2']));
    staffsServiceSpy.loadStaffs.and.returnValue(Promise.resolve(['Staff1', 'Staff2']));
    patientsServiceSpy.loadPatients.and.returnValue(Promise.resolve(['Patient1', 'Patient2']));
    operationTypesServiceSpy.loadOperationTypes.and.returnValue(Promise.resolve(['Type1', 'Type2']));
    operationTypesServiceSpy.loadPriority.and.returnValue(Promise.resolve(['High', 'Low']));
    
    await TestBed.configureTestingModule({
      imports: [OperationRequestsComponent],
      providers: [
        { provide: OperationRequestsService, useClass: operationRequestsServiceSpy },
        { provide: StaffsService, useClass: staffsServiceSpy },
        { provide: PatientsService, useClass: patientsServiceSpy },
        { provide: OperationTypesService, useClass: operationTypesServiceSpy },
        { provide: ChangeDetectorRef, useClass: cdrSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OperationRequestsComponent);
    component = fixture.componentInstance;
    
    operationRequestsService = TestBed.inject(OperationRequestsService) as jasmine.SpyObj<OperationRequestsService>;
    staffsService = TestBed.inject(StaffsService) as jasmine.SpyObj<StaffsService>;
    patientsService = TestBed.inject(PatientsService) as jasmine.SpyObj<PatientsService>;
    operationTypesService = TestBed.inject(OperationTypesService) as jasmine.SpyObj<OperationTypesService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});