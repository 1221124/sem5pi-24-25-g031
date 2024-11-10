import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';
import { OperationRequest } from '../../models/operation-request.model';


@Component({
  selector: 'app-operation-requests',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './operation-requests.component.html',
  styleUrls: ['./operation-requests.component.css'],
  providers: [OperationRequestsService]
})
export class OperationRequestsComponent {
   constructor(
    private service: OperationRequestsService  
  ) {}

  requests: OperationRequest[] = [];

  staffId: string = '';
  patientId: string = '';
  operationTypeId: string = '';
  deadlineDate: Date = new Date();
  priority: string = '';
  errorMessage: string = '';

  staffIdTouched: boolean = false;
  patientIdTouched: boolean = false;
  operationTypeIdTouched: boolean = false;
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

  // ngOnInit() {
  //   this.service.getAll().subscribe(
  //     (data) => {
  //       console.log('Fetched Operation Requests:', data);
  //       this.requests = data;
  //       console.log('Operation Requests loaded:', this.requests);
  //     },
  //     (error) => {
  //       console.error('Error loading Operation Requests:', error);
  //     }
  //   );
  // }

  ngOnInit() {
    this.service.getAll().subscribe(
      (data) => {
        this.requests = data.map(request => ({
          ...request,
          doctorId: request.doctorId,
          patientId: request.patientId.id || request.patientId,
          operationTypeId: request.operationTypeId.id || request.operationTypeId,
          deadlineDate: request.deadlineDate.date || request.deadlineDate,
        }));
        console.log('Processed Operation Requests:', this.requests);
      },
      (error) => {
        console.error('Error loading Operation Requests:', error);
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

    if (!this.isValidGuid(this.staffId)) {
        console.log('Invalid Staff ID format. Please provide a valid GUID.');
        this.errorMessage = 'Invalid Staff ID format. Please provide a valid GUID.';
        return this.errorMessage;
    }

    if (!this.isValidGuid(this.patientId)) {
        console.log('Invalid Patient ID format. Please provide a valid GUID.');
        this.errorMessage = 'Invalid Patient ID format. Please provide a valid GUID.';
        return this.errorMessage;
    }

    if (!this.isValidGuid(this.operationTypeId)) {
        console.log('Invalid Operation Type ID format. Please provide a valid GUID.');
        this.errorMessage = 'Invalid Operation Type ID format. Please provide a valid GUID.';
        return this.errorMessage;
    }

    if(!this.isValidDate(this.deadlineDate)) {
        console.log('Invalid Deadline Date. Please provide a valid date.');
        this.errorMessage = 'Invalid Deadline Date. Please provide a valid date.';
        return this.errorMessage;
    }

    if(!this.isValidPriority(this.priority)) {
        console.log('Invalid Priority. Please provide a valid priority.');
        this.errorMessage = 'Invalid Priority. Please provide a valid priority.';
        return this.errorMessage;
    }

    console.log('Calling service post method');
    this.service.post(this.staffId, this.patientId, this.operationTypeId, this.deadlineDate, this.priority);
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
    this.staffId = '';
    this.patientId = '';
    this.operationTypeId = '';
    this.deadlineDate = new Date();
    this.priority = '';

    this.staffIdTouched = false;
    this.patientIdTouched = false;
    this.operationTypeIdTouched = false;
    this.deadlineDateTouched = false;
    this.priorityTouched = false;

    this.createMode = false;
    this.showCreateButton = true;
    this.showReturnButton = false;
    this.showHttpPostButton = false;
  }
}
