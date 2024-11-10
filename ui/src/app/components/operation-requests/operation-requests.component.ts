import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';
import { OperationRequest } from '../../models/operation-request.model';
import { StaffsService } from '../../services/staffs/staffs.service';
import { PatientsService } from '../../services/patients/patients.service';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { Staff } from '../../models/staff.model';
import { Patient } from '../../models/patient.model';
import { OperationType } from '../../models/operation-type.model';

export enum Priority{
  ELECTIVE = 'Elective',
  URGENT = 'Urgent',
  EMERGENCY = 'Emergency'
} 

@Component({
  selector: 'app-operation-requests',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './operation-requests.component.html',
  styleUrls: ['./operation-requests.component.css'],
  providers: [OperationRequestsService, StaffsService, PatientsService, OperationTypesService]
})
export class OperationRequestsComponent {
   constructor(
    private service: OperationRequestsService, 
    private serviceStaff: StaffsService, 
    private servicePatient: PatientsService, 
    private serviceOperationType: OperationTypesService
  ) {}

  requests: OperationRequest[] = [];
  staffs: Staff[] = [];
  patients: Patient[] = [];
  operationTypes: OperationType[] = [];
  priorities: any[] = [];

  staff: string = '';
  patient: string = '';
  operationType: string = '';
  deadlineDate: Date = new Date();
  priority: string = '';
  errorMessage: string = '';

  staffTouched: boolean = false;
  patientTouched: boolean = false;
  operationTypeTouched: boolean = false;
  deadlineDateTouched: boolean = false;
  priorityTouched: boolean = false;

  showCreateButton: boolean = true;
  showReturnButton: boolean = false
  showHttpPostButton: boolean = false;
  returnButton: boolean = true;
  httpPostButton: boolean = false;

  createMode: boolean = false;
  returnMode: boolean = false;

  isModalOpen: boolean = false;

  closeModal() {
    this.isModalOpen = false;
  }

  ngOnInit() {
    this.priorities = Object.values(Priority);

    this.service.getAll().subscribe(
      (data) => {
        this.requests = data.map(request => ({
          id: request.id,
          staff: request.staff.value,
          patient: request.patient.value,
          operationType: request.operationType.value,
          deadlineDate: request.deadlineDate.date,
          priority: request.priority,
          status: request.status
        }));
        console.log('Processed Operation Requests:', this.requests);
      },
      (error) => {
        console.error('Error loading Operation Requests:', error);
      }
    );

    this.serviceStaff.getStaff().subscribe(
      (data) => {
        this.staffs = data.map((staff: {
          id: any; licenseNumber: any; 
        }) => ({
          id: staff.id,
          licenseNumber: staff.licenseNumber.value
        }));
        console.log('Processed Staff:', this.staffs);
      },
      (error) => {
        console.error('Error loading Staff:', error);
      }
    );

    this.servicePatient.getPatients().subscribe(
      (data) => {
        this.patients = data.map((patient: {
          id: any; medicalRecordNumber: any; 
        }) => ({
          id: patient.id,
          medicalRecordNumber: patient.medicalRecordNumber.value
        }));
        console.log('Processed Patients:', this.patients);
      },
      (error) => {
        console.error('Error loading Patients:', error);
      }
    );
  }

  return(){
    console.log('Return button clicked');
    this.clearForm();
    this.showCreateButton = true;
    this.showReturnButton = false;
    this.showHttpPostButton = false;
    this.createMode = false;
  }
  
  create() {
    console.log('Create button clicked');
    this.isModalOpen = true;
    this.createMode = true;
    this.showCreateButton = false;
    this.showReturnButton = true;
    this.showHttpPostButton = true;
  }
  

  submitRequest() {
    if (!this.createMode) return "";

    console.log('Submit button clicked');
    this.errorMessage = '';

    // if (!this.isValidGuid(this.staffId)) {
    //     console.log('Invalid Staff ID format. Please provide a valid GUID.');
    //     this.errorMessage = 'Invalid Staff ID format. Please provide a valid GUID.';
    //     return this.errorMessage;
    // }

    // if (!this.isValidGuid(this.patientId)) {
    //     console.log('Invalid Patient ID format. Please provide a valid GUID.');
    //     this.errorMessage = 'Invalid Patient ID format. Please provide a valid GUID.';
    //     return this.errorMessage;
    // }

    // if (!this.isValidGuid(this.operationTypeId)) {
    //     console.log('Invalid Operation Type ID format. Please provide a valid GUID.');
    //     this.errorMessage = 'Invalid Operation Type ID format. Please provide a valid GUID.';
    //     return this.errorMessage;
    // }

    // if(!this.isValidDate(this.deadlineDate)) {
    //     console.log('Invalid Deadline Date. Please provide a valid date.');
    //     this.errorMessage = 'Invalid Deadline Date. Please provide a valid date.';
    //     return this.errorMessage;
    // }

    // if(!this.isValidPriority(this.priority)) {
    //     console.log('Invalid Priority. Please provide a valid priority.');
    //     this.errorMessage = 'Invalid Priority. Please provide a valid priority.';
    //     return this.errorMessage;
    // }

    console.log('Calling service post method');
    this.service.post(this.staff, this.patient, this.operationType, this.deadlineDate, this.priority);
    this.clearForm();
    console.log('Operation Request submitted successfully!');
    return "Operation Request submitted successfully!";
  }

  closeErrorModal() {
    this.errorMessage = '';
  }

  isValidGuid(guid: string): boolean {
      const guidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
      return guidRegex.test(guid);
  }

  isValidDate(date: any): boolean {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date instanceof Date && !isNaN(date.getTime());
  }

  isValidPriority(priority: string): boolean {
    const priorities = ['Elective', 'Urgent', 'Emergency'];
    return priorities.includes(priority);
  }
 
  clearForm() {
    this.staff = '';
    this.patient = '';
    this.operationType = '';
    this.deadlineDate = new Date();
    this.priority = '';

    this.staffTouched = false;
    this.patientTouched = false;
    this.operationTypeTouched = false;
    this.deadlineDateTouched = false;
    this.priorityTouched = false;

    this.createMode = false;
    this.showCreateButton = true;
    this.showReturnButton = false;
    this.showHttpPostButton = false;
  }
}
