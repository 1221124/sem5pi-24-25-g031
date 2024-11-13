import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';
import { OperationRequest } from '../../models/operation-request.model';
import { StaffsService } from '../../services/staffs/staffs.service';
import { PatientsService } from '../../services/admin-patients/admin-patients.service';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { Staff } from '../../models/staff.model';
import { Patient } from '../../models/patient.model';
import { OperationType } from '../../models/operation-type.model';

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
  filters: any[] = [];
  filteredRequests: OperationRequest[] = [];

  id: string = '';
  staff: string = '';
  patient: string = '';
  operationType: string = '';
  deadlineDate: Date = new Date();
  priority: string = '';
  status: string = '';

  searchId: string = '';
  searchLicenseNumber: string = '';
  searchPatientName: string = '';
  searchOperationType: string = '';
  searchDeadlineDate: Date = new Date();
  searchPriority: string = '';
  searchStatus: string = '';
  searchActions: string = '';

  errorMessage: string = '';

  request: OperationRequest = {
    id: '',
    staff: '',
    patient: '',
    operationType: '',
    deadlineDate: new Date(),
    priority: 'null',
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
  isFilterModalOpen: boolean = false;

  filter = {
    pageNumber: 0,
    name: '',
    specialization: '',
    status: ''
  }

  currentPage: number = 1;
  totalPages: number = 1; // Total de páginas após o filtro
  itemsPerPage: number = 5;  // Número de itens por página

  constructor(
    private service: OperationRequestsService,
    private serviceStaff: StaffsService,
    private servicePatient: PatientsService,
    private serviceOperationType: OperationTypesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadOperationRequests();
    this.loadStaffs();
    this.loadPatients();
    this.loadOperationTypes();
    this.loadPriority();
    // this.loadRequestStatus();
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  refresh() {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.requests.length / this.itemsPerPage);

    this.cdr.detectChanges();
  }

  loadPriority() {
    this.priorities = ['Elective', 'Urgent', 'Emergency'];
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

  create() {
    console.log('Create button clicked');
    if (!this.isFormValid()) return;
    this.service.post(this.staff, this.patient, this.operationType, this.deadlineDate, this.priority);
    this.closeCreateModal();
    this.refresh();
    console.log('Operation Request submitted successfully!');
    this.clearForm();
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

  openUpdateModal(request: OperationRequest) {
    console.log('Open Update Modal clicked');

    this.request = request; // This will ensure the modal gets the correct request object
    this.status = request.status;  // Initialize the status model in the form
    this.deadlineDate = request.deadlineDate;  // Initialize deadlineDate model
    this.priority = request.priority;  // Initialize priority model
    this.isUpdateModalOpen = true;
    console.log('Request:', this.request);
  }

  closeUpdateModal() {
    console.log('Close Update Modal clicked');
    this.isUpdateModalOpen = false;
  }

  update(){
    console.log('Update button clicked');

    console.log('Request:', this.request);

    this.service.put(this.request.id, this.request.deadlineDate, this.request.priority, this.request.status);
    this.closeUpdateModal();
    this.refresh();
    console.log('Operation Request updated successfully!');
    this.clearForm();
  }

  confirmUpdate(update: OperationRequest) {
    if (this.request) {
      console.log("Request before update:", this.request);

      if (update.status !== undefined) {
        console.log("Updating status:", update.status);
        this.request.status = update.status;
      }
      if (update.deadlineDate !== undefined) {
        console.log("Updating deadlineDate:", update.deadlineDate);
        this.request.deadlineDate = update.deadlineDate;
      }
      if (update.priority !== undefined) {
        console.log("Updating priority:", update.priority);
        this.request.priority = update.priority;
      }

      this.update();

      console.log('Update confirmed');
      console.log("Updated request:", this.request);

      this.isUpdateModalOpen = false; // Close the modal after update
      this.closeUpdateModal(); // Close modal properly
    } else {
      console.error("Request object is not defined.");
    }
  }

  filterRequests() {
    console.log('Filter button clicked');

    this.service.get(this.searchId, this.searchLicenseNumber, this.searchPatientName, this.searchOperationType, this.searchDeadlineDate, this.searchPriority, this.searchStatus).subscribe(
      (data) => {
        this.filteredRequests = data;
        this.requests = this.filteredRequests;
        console.log('Filtered Operation Requests:', this.requests);
        console.log('Operation Requests filtered successfully!');
        this.applyFilter();
      },
      (error) => {
        console.error('Error filtering Operation Requests:', error);
      }
    );
    console.log('Operation Requests filtered successfully!');
  }

  applyFilter(): void {
    this.refresh();
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
    this.id = '';
    this.staff = '';
    this.patient = '';
    this.operationType = '';
    this.deadlineDate = new Date();
    this.priority = 'null';
    this.status = '';

    this.staffTouched = false;
    this.patientTouched = false;
    this.operationTypeTouched = false;
    this.deadlineDateTouched = false;
    this.priorityTouched = false;
    this.statusTouched = false;

    this.errorMessage = '';

    this.deleteConfirmation = false;
    this.updateConfirmation = false;

    this.isCreateModalOpen = false;
    this.isUpdateModalOpen = false;
    this.isDeleteModalOpen = false;
  }
}
