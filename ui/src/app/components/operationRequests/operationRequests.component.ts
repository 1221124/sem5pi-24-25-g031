import { Component, NgModule } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppComponent } from '../../app.component';

@NgModule({
  declarations: [
    AppComponent, OperationRequestsComponent
  ],
  
  imports: [
    FormsModule
  ],
  bootstrap: [AppComponent]
})

@Component({
  selector: 'app-operation-requests',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './operationRequests.component.html',
  styleUrls: ['./operationRequests.component.css']
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

    constructor(private http: HttpClient) {}

    submitRequest() {
      console.log('Submit button clicked');
      this.message = '';

        if (!this.isValidGuid(this.staffId)) {
            this.message = 'Invalid Staff ID format. Please provide a valid GUID.';
            return;
        }

        if (!this.isValidGuid(this.patientId)) {
            this.message = 'Invalid Patient ID format. Please provide a valid GUID.';
            return;
        }

        if (!this.isValidGuid(this.operationTypeId)) {
            this.message = 'Invalid Operation Type ID format. Please provide a valid GUID.';
            return;
        }

        if(!this.isValidDate(this.deadlineDate)) {
            this.message = 'Invalid Deadline Date. Please provide a valid date.';
            return;
        }

        if(!this.isValidPriority(this.priority)) {
            this.message = 'Invalid Priority. Please provide a valid priority.';
            return;
        }

        const creatingOperationRequestDto = {
            staffId: this.staffId,
            patientId: this.patientId,
            operationTypeId: this.operationTypeId,
            deadlineDate: this.deadlineDate.toISOString().split('T')[0],
            priority: this.priority
        };

        const apiUrl = 'http://localhost:4200/api/OperationRequests';    

        this.http.post(apiUrl, creatingOperationRequestDto).subscribe(
          response => {
              this.message = 'Operation request submitted successfully!';
          },
          error => {
              this.message = 'Error submitting operation request. Please try again.';
          }
        );
      
    }

    isValidGuid(guid: string): boolean {
        const guidRegex = new RegExp('^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$', 'i');
        return guidRegex.test(guid);
    }

    isValidDate(date: Date): boolean {
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