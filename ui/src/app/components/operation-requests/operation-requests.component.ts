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

export enum Priority {
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
  requests: OperationRequest[] = [];
  staffs: Staff[] = [];
  patients: Patient[] = [];
  operationTypes: OperationType[] = [];
  priorities: string[] = [];
  // status: string[] = [];
  statuses: string[] = ['Pending', 'Accepted', 'Rejected']; 

  id: string = '';
  staff: string = '';
  patient: string = '';
  operationType: string = '';
  deadlineDate: Date = new Date();
  priority: string = '';
  status: string = '';
  errorMessage: string = '';

  request: OperationRequest = {
    id: '',
    staff: '',
    patient: '',
    operationType: '',
    deadlineDate: new Date(),
    priority: '',
    status: ''
  };
  
  staffTouched: boolean = false;
  patientTouched: boolean = false;
  operationTypeTouched: boolean = false;
  deadlineDateTouched: boolean = false;
  priorityTouched: boolean = false;
  statusTouched: boolean = false;

  deleteConfirmation: boolean = false;
  updateConfirmation: boolean = false;
  
  isCreateModalOpen: boolean = false;
  isUpdateModalOpen: boolean = false;
  isDeleteModalOpen: boolean = false;

  filter = {
    pageNumber: 0,
    name: '',
    specialization: '',
    status: ''
  }

  constructor(
    private service: OperationRequestsService,
    private serviceStaff: StaffsService,
    private servicePatient: PatientsService,
    private serviceOperationType: OperationTypesService
  ) {}

  ngOnInit() {
    this.loadOperationRequests();
    this.loadStaffs();
    this.loadPatients();
    this.loadOperationTypes();
    this.loadPriority();
    // this.loadRequestStatus();
  }

  refresh() {
    this.loadOperationRequests();
  }

  // loadRequestStatus(){
  //   this.statuses = Object.values
  // }

  loadPriority() {
    this.priorities = Object.values(Priority);
  }

  loadOperationRequests() {
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
  }

  loadStaffs() {
    this.serviceStaff.getStaff().subscribe(
      (data) => {
        this.staffs = data.map((staff: { licenseNumber: any; contactInformation: any; }) => ({
          licenseNumber: staff.licenseNumber.value,
          email: staff.contactInformation.email.value
        }));
        console.log('Processed Staff:', this.staffs);
      },
      (error) => {
        console.error('Error loading Staff:', error);
      }
    );
  }

  loadPatients() {
    this.servicePatient.getPatients().subscribe(
      (data) => {
        this.patients = data.map((patient: { contactInformation: any; medicalRecordNumber: any; }) => ({
          email: patient.contactInformation.email.value,
          medicalRecordNumber: patient.medicalRecordNumber.value
        }));
        console.log('Processed Patients:', this.patients);
      },
      (error) => {
        console.error('Error loading Patients:', error);
      }
    );
  }

  loadOperationTypes() {
    this.serviceOperationType.getOperationTypes(this.filter).then(
      (response) => {
        if (response.status === 200 && response.body) {
          this.operationTypes = response.body.operationTypes;
        } else {
          console.error('Unexpected response status or null response body:', response);
        }
      }
    );
  }

  openCreateModal() {
    console.log('Open Create Modal clicked');
    this.isCreateModalOpen = true;
    this.create();
  }

  closeCreateModal() {
    console.log('Close Create Modal clicked');
    this.isCreateModalOpen = false;
  }

  openUpdateModal(request: OperationRequest) {
    console.log('Open Update Modal clicked');
    this.isUpdateModalOpen = true;

    this.deadlineDate = request.deadlineDate;
    this.priority = request.priority;
    this.status = request.status;

    this.update(request);
  }

  closeUpdateModal() {
    console.log('Close Update Modal clicked');
    this.isUpdateModalOpen = false;
  }

  openDeleteModal(request: OperationRequest) {
    console.log('Open Delete Modal clicked');
    this.isDeleteModalOpen = true;

    this.id = request.id;
  }

  closeDeleteModal() {
    console.log('Close Delete Modal clicked');
    this.isDeleteModalOpen = false;

    this.id = '';
  }

  create() {
    console.log('Create button clicked');
    if (!this.isFormValid()) return;
    this.service.post(this.staff, this.patient, this.operationType, this.deadlineDate, this.priority);
    this.closeCreateModal();
    this.refresh();
    console.log('Operation Request submitted successfully!');
    this.clearForm();
  }

  delete(request: string) {
    console.log('Delete button clicked');
    this.service.delete(request);
    console.log('Operation Request deleted successfully!');
    this.clearForm();
    this.refresh();
  }
  
  confirmDelete() {
    if (this.id) {
      console.log('Delete confirmed');
      this.delete(this.id);
      this.isDeleteModalOpen = false;
      this.closeDeleteModal();
    }
  }

  update(request: OperationRequest){
    console.log('Update button clicked');
    this.service.put(request.id, this.deadlineDate, this.priority, this.status);
    this.closeUpdateModal();
    this.refresh();
    console.log('Operation Request updated successfully!');
    this.clearForm();
  }

  confirmUpdate(){
    this.updateConfirmation = true;
  }

  isFormValid(): boolean {
    if (!this.staff || !this.patient || !this.operationType || !this.priority || !this.deadlineDate) {
      console.log('Please fill in all required fields.');
      return false;
    }
    if (!this.isValidDate(this.deadlineDate)) {
      console.log('Please provide a valid date.');
      return false;
    }
    return true;
  }

  isValidDate(date: any): boolean {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }

    return date instanceof Date && !isNaN(date.getTime());
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
    this.errorMessage = '';
  }
}
