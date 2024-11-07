import { Component } from '@angular/core'; 
import { FormsModule } from '@angular/forms';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';

@Component({
  selector: 'app-operation-requests',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './operation-requests.component.html',
  styleUrls: ['./operation-requests.component.css'],
  providers: [OperationRequestsService]
})
export class OperationRequestsComponent {

  staffId: string = '';
  patientId: string = '';
  operationTypeId: string = '';
  deadlineDate: Date = new Date();
  priority: string = '';
  message: string = '';

  staffIdTouched = false;
  patientIdTouched = false;
  operationTypeIdTouched = false;
  deadlineDateTouched = false;
  priorityTouched = false;

  constructor(
    private service: OperationRequestsService  
  ) {}

  submitRequest() {
    console.log('Submit button clicked');
    this.message = '';

    if (!this.isValidGuid(this.staffId)) {
        console.log('Invalid Staff ID format. Please provide a valid GUID.');
        return;
    }

    if (!this.isValidGuid(this.patientId)) {
        console.log('Invalid Patient ID format. Please provide a valid GUID.');
        return;
    }

    if (!this.isValidGuid(this.operationTypeId)) {
        console.log('Invalid Operation Type ID format. Please provide a valid GUID.');
        return;
    }

    if(!this.isValidDate(this.deadlineDate)) {
        console.log('Invalid Deadline Date. Please provide a valid date.');
        return;
    }

    if(!this.isValidPriority(this.priority)) {
        console.log('Invalid Priority. Please provide a valid priority.');
        return;
    }

    console.log('Calling service post method');
    this.service.post(this.staffId, this.patientId, this.operationTypeId, this.deadlineDate, this.priority);
    console.log('aaa');
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
    console.log('Clear button clicked');
    this.staffId = '';
    this.patientId = '';
    this.operationTypeId = '';
    this.deadlineDate = new Date();
    this.priority = '';
    this.message = '';

    this.staffIdTouched = false;
    this.patientIdTouched = false;
    this.operationTypeIdTouched = false;
    this.deadlineDateTouched = false;
    this.priorityTouched = false;
  }
}
