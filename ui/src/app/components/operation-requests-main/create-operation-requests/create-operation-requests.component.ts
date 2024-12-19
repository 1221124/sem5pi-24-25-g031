import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Patient} from '../../../models/patient.model';
import {OperationType} from '../../../models/operation-type.model';
import {PatientsService} from '../../../services/admin-patients/admin-patients.service';
import {OperationTypesService} from '../../../services/operation-types/operation-types.service';
import {OperationRequestsService} from '../../../services/operation-requests/operation-requests.service';
import {FormsModule} from '@angular/forms';
import {OperationRequest} from '../../../models/operation-request.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';

@Component({
  selector: 'app-create-operation-requests',
  templateUrl: './create-operation-requests.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
  ],
  styleUrls: ['./create-operation-requests.component.css'],
  providers: []
})
export class CreateOperationRequestComponent implements OnInit {
  @Input() request!: OperationRequest;
  @Output() createRequestEvent = new EventEmitter<OperationRequest>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  constructor(
    private authService: AuthService,
    private service: OperationRequestsService,
    private servicePatient: PatientsService,
    private serviceOperationType: OperationTypesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  patients: Patient[] = [];
  operationTypes: OperationType[] = [];
  priorities: string[] = [];
  statuses: string[] = [];

  accessToken: string = '';
  success: boolean = false;
  message: string = '';

  isProcessing: boolean = false;

  patientTouched: boolean = false;
  operationTypeTouched: boolean = false;
  deadlineDateTouched: boolean = false;
  priorityTouched: boolean = false;

  selectedPatient: string = '';
  selectedOperationType: string = '';
  selectedDeadlineDate: string = '';
  selectedPriority: string = '';


  requestCode: string = '';
  staff: string = '';
  patient: string = '';
  operationType: string = '';
  deadlineDate: string = '';
  priority: string = '';
  status: string = '';

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    await this.loadPatients(); if(!this.success) console.log('Error loading patients:', this.message);

    await this.loadOperationTypes(); if(!this.success) console.log('Error loading operation types:', this.message);

    await this.loadPriority(); if (!this.success) console.log('Error loading priorities:', this.message);

    await this.loadRequestStatus(); if (!this.success) console.log('Error loading request statuses:', this.message);
  }
  
  async loadPatients() {
    try {
      const response = await this.servicePatient.getPatients(this.accessToken);

      console.log("patients", response);

      this.patients = response.body.patient;

      console.log("patients", this.patients);

      this.success = true;
      this.message = 'Patients loaded!';
    } catch (error) {
      console.error('Error loading patients:', error);
      this.success = false;
    }
  }

  async loadOperationTypes() {
    var filter ={
      specialization: '',
      status: ''
    }
    
    try {
      const response = await this.serviceOperationType.getOperationTypes(filter, this.accessToken);
      
      console.log("response", response);
      
      this.operationTypes = response.body?.operationTypes || [];

      console.log("operationTypes", this.operationTypes); 

      this.success = true;
      this.message = 'Operation Types loaded!';
    } catch (error) {
      console.error('Error loading operation types:', error);
      this.success = false;
    }
  }

  async loadPriority() {
    try {
      const response = await this.service.getPriority(this.accessToken);
      this.priorities = response.body || [];
      this.success = true;
      this.message = 'Priorities loaded!';
    } catch (error) {
      console.error('Error loading priorities:', error);
      this.success = false;
    }
  }

  async loadRequestStatus() {
    try {
      const response = await this.service.getRequestStatus(this.accessToken);
      this.statuses = response.body.map(status => status.value) || [];
      this.success = true;
      this.message = 'Request Status loaded!';
    } catch (error) {
      console.error('Error loading request statuses:', error);
      this.success = false;
    }
  }

  submit() {
    console.log('submit');
    if (this.isProcessing) {
      console.log('Already processing, ignoring duplicate submission.');
      return; // Prevent duplicate submissions
    }

    this.isProcessing = true;

    this.request.patient = this.selectedPatient;
    this.request.operationType = this.selectedOperationType;
    this.request.deadlineDate = this.selectedDeadlineDate;
    this.request.priority = this.selectedPriority;

    console.log('Emitting request:', this.request);
    this.createRequestEvent.emit(this.request);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        patient: this.request.patient,
        operationType: this.request.operationType,
        deadlineDate: this.request.deadlineDate,
        priority: this.request.priority
      },
      queryParamsHandling: 'merge'
    });

    setTimeout(() => {
      this.isProcessing = false;
    }, 5000);
  }

  emitCloseModalEvent(){
    this.closeModalEvent.emit();
  }
}
