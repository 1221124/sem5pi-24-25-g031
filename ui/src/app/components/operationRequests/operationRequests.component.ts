import { Component, NgModule } from '@angular/core'; 
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from '../../app.component';

enum Priority {
  DEFAULT = '',
  ELECTIVE = 'Elective',
  URGENT = 'Urgent',
  EMERGENCY = 'Emergency'
}

@NgModule({
  declarations: [
    AppComponent, OperationRequestsComponent
  ],
  
  imports: [
    FormsModule, HttpClientModule
  ],
  bootstrap: [AppComponent]
})

@Component({
  selector: 'app-operationRequests',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './operationRequests.component.html',
  styleUrls: ['./operationRequests.component.css']
})
export class OperationRequestsComponent {

    staffId: string = 'Staff Id';
    patientId: string = 'Patient Id';
    operationTypeId: string = 'Operation Type Id';
    deadlineDate: Date = new Date("0001-01-01");
    priority: Priority = Priority.DEFAULT;
    message: string | undefined;

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
    
    priorityOptions() {
        return ['Elective', 'Urgent', 'Emergency'];
  }  
}
