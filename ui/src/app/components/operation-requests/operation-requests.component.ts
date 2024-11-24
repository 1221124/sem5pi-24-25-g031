import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OperationRequestsService } from '../../services/operation-requests/operation-requests.service';
import { OperationRequest } from '../../models/operation-request.model';
import { StaffsService } from '../../services/staffs/staffs.service';
import { PatientsService } from '../../services/admin-patients/admin-patients.service';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { Staff } from '../../models/staff.model';
import { OperationType } from '../../models/operation-type.model';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import {Patient} from '../../models/patient.model';

@Component({
  selector: 'app-operation-requests',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './operation-requests.component.html',
  styleUrls: ['./operation-requests.component.css'],
})
export class OperationRequestsComponent implements OnInit {
  requests: OperationRequest[] = [];
  staffs: Staff[] = [];
  patients: any[] = [];
  operationTypes: OperationType[] = [];
  priorities: string[] = [];
  statuses: string[] = [];

  id: string = '';
  staff: string = '';
  patient: any = '';
  operationType: string = '';
  deadlineDate: string = '';
  priority: string = '';
  status: string = '';

  message: string = '';
  success: boolean = false;

  request: OperationRequest = {
    id: '',
    staff: '',
    patient: '',
    operationType: '',
    deadlineDate: '',
    priority: '',
    status: '',
    requestCode: ''
  };

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

  staffFilter = {
    pageNumber: 1,
    name: '',
    email: '',
    specialization: ''
  }

  filters = {
    searchId: '',
    searchLicenseNumber: '',
    searchPatientName: '',
    searchOperationType: '',
    searchDeadlineDate: '',
    searchPriority: '',
    searchStatus: '',
    searchActions: ''
  }

  totalItems: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;

  accessToken: string = '';

  constructor(
    private service: OperationRequestsService,
    private serviceStaff: StaffsService,
    private servicePatient: PatientsService,
    private serviceOperationType: OperationTypesService,
    private authService: AuthService,
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a doctor! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']).then(r => {
          console.log('Redirected to login page');
        });
      }, 3000);
      return;
    }
    this.accessToken = this.authService.getToken();
    console.log("access token: ", this.accessToken);
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage(
        'You are not authenticated or are not a doctor! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.staffFilter.email = this.authService.extractEmailFromAccessToken(this.accessToken) as string;
    if (!this.staffFilter.email) {
      throw new Error('Error extracting email from access token');
    }
    this.serviceStaff.getStaff(this.staffFilter, this.accessToken).then(response => {
      if (response.status === 200) {
        this.staff = response.body.staffs[0].licenseNumber;
        return response;
      } else {
        console.error('Unexpected response status:', response.status);
        return response;
      }
    }).catch(error => {
      console.error('Error loading staff:', error);
      return error;
    });

    console.log("loading op requests...");
    await this.loadOperationRequests();
    console.log("op requests: ", this.requests);
    console.log("loading staffs...");
    await this.loadStaffs();
    console.log("staffs: ", this.staffs);
    console.log("loading patients...");
    await this.loadPatients();
    console.log("patients: ", this.patients);
    console.log("loading op types...");
    await this.loadOperationTypes();
    console.log("op types: ", this.operationTypes);
    console.log("loading priorities...");
    await this.loadPriority();
    console.log("priorities: ", this.priorities);
    console.log("loading request status...");
    await this.loadRequestStatus();
    console.log("request status: ", this.statuses);
    console.log("done loading...");
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  async clear() {
    this.clearForm();

    await this.ngOnInit();
  }

  async loadRequestStatus() {
    await this.service.getRequestStatus(this.accessToken)
      .then(response => {
        if (response.status === 200 && response.body) {
          this.statuses = response.body.map(status => status.value);
          this.message = 'Request Status obtained!';
          this.success = true;
        } else {
          this.statuses = [];
          this.message = 'Response body is null: ' + response.body;
          this.success = false;
        }
      }).catch(error => {
        if(error.status === 404){
          this.statuses = [];
          this.message = 'No Request Status found!';
          this.success = false;
        } else if(error.status === 401) {
          this.statuses = [];
          this.message = 'You are not authorized to view Request Status! Please log in...';
          this.success = false;
        } else {
          this.statuses = [];
          this.message = 'There was an error fetching the Request Status: ' + error;
          this.success = false;
        }
      });
  }

  async loadPriority() {
    await this.service.getPriority(this.accessToken)
      .then(response => {
        if (response.status === 200 && response.body) {
          this.priorities = response.body;
          this.message = 'Priorities obtained!';
          this.success = true;
        } else {
          this.priorities = [];
          this.message = 'Response body is null: ' + response.body;
          this.success = false;
        }
      }).catch(error => {
        if (error.status === 404) {
          this.priorities = [];
          this.message = 'No Priorities found!';
          this.success = false;
        } else if (error.status === 401) {
          this.priorities = [];
          this.message = 'You are not authorized to view Priorities! Please log in...';
          this.success = false;
        } else {
          this.priorities = [];
          this.message = 'There was an error fetching the Priorities: ' + error;
          this.success = false;
        }
      });
  }

  async loadOperationRequests() {
    await this.service.getAll(this.accessToken)
      .then(response  => {
        if(response.status === 200 || response.status === 201){
          console.log("response.body: ", response.body);

          if (Array.isArray(response.body)) {
            this.requests = response.body.map(request => ({
              id: request.id,
              staff: request.staff,
              patient: request.patient,
              operationType: request.operationType,
              deadlineDate: request.deadlineDate,
              priority: request.priority,
              status: request.status,
              requestCode: request.requestCode
            }));
            console.log('Operation Requests obtained:', this.requests);

            this.message = 'Operation Requests obtained!';
            this.success = true;
            this.totalItems = response.body.length || 0;
            this.totalPages = Math.ceil(this.totalItems / 2);
          } else{
            this.requests = [];
            this.message = 'Response body is null: ' + response.body;
            this.success = false;
            this.totalItems = 0;
            this.totalPages = 1;
          }
        }else{
          this.requests = [];
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      }).catch(error => {
        if (error.status === 404) {
          this.requests = [];
          this.message = 'No Operation Requests found!';
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        } else if (error.status === 401) {
          this.message = 'You are not authorized to view Operation Requests! Please log in...';
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        } else {
          this.requests = [];
          this.message = 'There was an error fetching the Operation Requests: ' + error;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }

  async loadStaffs() {
    await this.serviceStaff.getStaff(this.filter, this.accessToken)
      .then(response => {
        if(response.status === 200 || response.status === 201){
          if(response.body){
            this.staffs = response.body.staffs.map(
              staff => {
                return {
                  ...staff,
                  name: staff.FullName.FirstName.Value + ' ' + staff.FullName.LastName.Value,
                  licenseNumber: staff.licenseNumber
                };
              }
            )

            this.message = 'Staffs obtained!';
            this.success = true;
          }else{
            this.staffs = [];
            this.message = 'Response body is null: ' + response.body;
            this.success = false;
          }
        }else{
          this.staffs = [];
          this.message = 'Unexpected response status: ' + response.status;
          this.success = true;
        }
      }).catch(error =>{
        if(error.status === 404){
          this.staffs = [];
          this.message = 'No staffs found!';
          this.success = false;
        }else if (error.status === 401) {
          this.message = 'You are not authorized to view Staffs! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }else {
          this.staffs = [];
          this.message = 'There was an error fetching the Staffs: ' + error;
          this.success = false;
        }
      });
  }

  async loadPatients() {
    try {
      const data = await this.servicePatient.getPatients(this.accessToken).toPromise();
      console.log("data: ", data);
      this.patients = data.map((patient: { appointmentHistory: any[] }) => ({
        ...patient,
        appointmentHistory: patient.appointmentHistory.map(slot => ({
          start: new Date(slot.start),
          end: new Date(slot.end)
        }))
      }));
      this.message = 'Patients obtained!';
      this.success = true;
    }catch (error) {
      console.error('Error loading patients:', error);
      this.patients = [];
      this.message = 'There was an error fetching the Patients: ' + error;
      this.success = false;
    }
  }

  async loadOperationTypes(){
    await this.serviceOperationType.getOperationTypes(this.filter, this.accessToken)
      .then(response =>{
        if(response.status === 200 || response.status === 201){
          if(response.body){
            this.operationTypes = response.body.operationTypes.map(operationType => {
              return {
                ...operationType,
                name: operationType.Name.Value,
                specialization: operationType.Specialization
              }
            });


            this.message = 'Operation Types obtained!';
            this.success = true;
          }else{
            this.operationTypes = [];
            this.message = 'Response body is null: ' + response.body;
            this.success = false;
          }
        } else{
          this.operationTypes = [];
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      }).catch(error => {
        if(error.status === 400){
          this.operationTypes = [];
          this.message = 'No Operation Types found!';
          this.success = false;
        } else if (error.status === 401){
          this.operationTypes = [];
          this.message = 'You are not authorized to view Operation Types! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }else{
          this.operationTypes = [];
          this.message = 'There was an error fetching the Operation Types: ' + error;
          this.success = false;
        }
      });
  }

  async openCreateModal() {
    console.log('Open Create Modal clicked');
    this.isCreateModalOpen = true;
    await this.create();
  }

  closeCreateModal() {
    console.log('Close Create Modal clicked');
    this.isCreateModalOpen = false;
  }

  async create() {
    console.log('Create button clicked');
    if (!this.isFormValid()) return;
    await this.service.post(this.accessToken, this.staff, this.patient, this.operationType, this.deadlineDate, this.priority);
    this.closeCreateModal();
    // this.refresh();
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

  async delete(request: string) {
    console.log('Delete button clicked');
    await this.service.delete(this.accessToken, request);
    console.log('Operation Request deleted successfully!');
    this.clearForm();
    // this.refresh();
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

  async update() {
    console.log('Update button clicked');

    console.log('Request:', this.request);

    await this.service.put(this.accessToken, this.request.id, this.request.deadlineDate, this.request.priority, this.request.status)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Operation Request successfully updated!';
          this.success = true;
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      }).catch(error => {
        if (error.status === 401) {
          this.message = 'You are not authorized to update Operation Requests! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']).then();
          }, 3000);
          return;
        }
        this.message = 'There was an error updating the Operation Request: ' + error;
        this.success = false;
      });

    this.closeUpdateModal();
    console.log('Operation Request updated successfully!');
    this.clearForm();
  }

  async confirmUpdate(update: OperationRequest) {
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

      await this.update();

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

    this.applyFilter();
    // this.refresh();

    console.log('Operation Requests filtered successfully!');
  }

  async applyFilter() {
    await this.service.get(
      this.accessToken,
      this.filters.searchId,
      this.filters.searchLicenseNumber,
      this.filters.searchPatientName,
      this.filters.searchOperationType,
      this.filters.searchDeadlineDate,
      this.filters.searchPriority,
      this.filters.searchStatus
    ).then(
      (response) => {
        console.log("response: ", response);

        if (response.status === 200) {
          this.requests = response.body.map(request =>
            ({
              id: request?.id,
              staff: request?.staff,
              patient: request?.patient,
              operationType: request?.operationType,
              deadlineDate: request?.deadlineDate,
              priority: request.priority,
              status: request.status,
              requestCode: request.requestCode
            })
          );

          console.log('Filtered Operation Requests:', this.requests);
          this.currentPage = 1;
          this.totalPages = Math.ceil(this.requests.length / 2);
        } else {
          console.error('Unexpected response status:', response.status);
        }
      }
    ).catch(
      (error) => {
        console.error('Error loading Operation Requests:', error);
      }
    )
    // ).subscribe(
    //   (data) => {
    //     this.requests = data.map(request =>
    //       ({
    //         id: request.id,
    //         staff: request.staff,
    //         patient: request.patient,
    //         operationType: request.operationType,
    //         deadlineDate: request.deadlineDate,
    //         priority: request.priority,
    //         status: request.status
    //       })
    //     );
    //     console.log('Filtered Operation Requests:', this.requests);
    //     this.currentPage = 1;
    //     this.totalPages = Math.ceil(this.requests.length / this.itemsPerPage);
    //   },
    //   (error) => {
    //     console.error('Error loading Operation Requests:', error);
    //   }
    // );
  }

  isFormValid(): boolean {
    if (!this.patient || !this.operationType || !this.priority || !this.deadlineDate) {
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
    this.patient = '';
    this.operationType = '';
    this.priority = '';
    this.deadlineDate = '';
    this.status = '';

    this.patientTouched = false;
    this.operationTypeTouched = false;
    this.deadlineDateTouched = false;
    this.priorityTouched = false;
    this.statusTouched = false;

    this.deleteConfirmation = false;
    this.updateConfirmation = false;

    this.isCreateModalOpen = false;
    this.isUpdateModalOpen = false;
    this.isDeleteModalOpen = false;

    this.filter = {
      pageNumber: 0,
      name: '',
      specialization: '',
      status: ''
    }

    this.filters = {
      searchId: '',
      searchLicenseNumber: '',
      searchPatientName: '',
      searchOperationType: '',
      searchDeadlineDate: '',
      searchPriority: '',
      searchStatus: '',
      searchActions: ''
    }

    this.totalItems = 0;
    this.totalPages = 1;
    this.currentPage = 1;

    this.accessToken = '';
  }
}
