import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import {OperationRequest} from '../../../models/operation-request.model';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {OperationType} from '../../../models/operation-type.model';
import {OperationRequestsService} from '../../../services/operation-requests/operation-requests.service';
import {AuthService} from '../../../services/auth/auth.service';
import {OperationTypesService} from '../../../services/operation-types/operation-types.service';
import {DeleteOperationRequestsComponent} from '../delete-operation-requests/delete-operation-requests.component';

@Component({
  selector: 'app-operation-requests-table',
  templateUrl: './operation-requests-table.component.html',
  styleUrls: ['./operation-requests-table.component.css'],
  imports: [
    NgForOf,
    FormsModule,
    DeleteOperationRequestsComponent,
    NgIf
  ],
  providers: [OperationRequestsService],
  standalone: true
})
export class OperationRequestsTableComponent implements OnInit {
  @Input() requests!: OperationRequest[];
  @Input() accessToken!: string;
  @Input() toMakeAppointment!: boolean;

  @Output() updateRequestEvent = new EventEmitter<OperationRequest>();
  @Output() deleteRequestEvent = new EventEmitter<OperationRequest>();
  @Output() createAppointmentEvent = new EventEmitter<OperationRequest>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: OperationRequestsService,
    private operationTypesService: OperationTypesService,
    private authService: AuthService
  ) {
  }

  selectedRequest!: OperationRequest;
  filteredRequests: OperationRequest[] = [];
  displayRequests: OperationRequest[] = [];

  operationTypes: OperationType[] = [];
  priorities: string[] = [];
  statuses: string[] = [];

  pages = {
    currentPage: 1,
    totalPages: 0
  }

  filter = {
    searchRequestCode: '',
    searchLicenseNumber: '',
    searchPatientName: '',
    searchOperationType: '',
    searchDeadlineDate: '',
    searchPriority: '',
    searchStatus: ''
  };

  success: boolean = true;

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthWithRole(['Admin', 'Doctor'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    console.log('Requests:', this.requests);

    await this.initialData();

    if(!this.success){
      console.error('Failed to load initial data');
      return;
    }

    if (!this.requests) {
      this.requests = [];
    }

    this.filteredRequests = [...this.requests];
    this.displayRequests = [];
    this.pages.currentPage = 1;
    this.pages.totalPages = Math.ceil(this.requests.length / 2);
    this.changePage(this.pages.currentPage);

  }

  async initialData() {
    const emptyFilter ={
      specialization: '',
      status: ''
    }

    try {
      const response = await this.service.getAll(this.accessToken);

      if (response.status === 200 || response.status === 201) {
        this.requests = response.body || [];
      } else {
        console.error('Failed to fetch requests:', response.status);
        this.requests = [];
      }
    } catch (error) {
      console.error('Error during initial data fetch:', error);
      this.requests = [];
    }

    try {
      const response = await this.operationTypesService.getOperationTypes(emptyFilter, this.accessToken);
      
      console.log("response", response);
      
      this.operationTypes = response.body?.operationTypes || [];

      console.log("operationTypes", this.operationTypes); 

    } catch (error) {
      console.error('Error loading operation types:', error);
      this.success = false;
    }
  

    try {
      const response = await this.service.getPriority(this.accessToken);
      if (response.status === 200 || response.status === 201) {
        this.priorities = response.body || [];
      } else {
        console.error('Failed to fetch priorities:', response.status);
        this.priorities = [];
      }
    } catch (error) {
      console.error('Error during priorities fetch:', error);
      this.success = false;
      this.priorities = [];
    }

    try {
      const response = await this.service.getRequestStatus(this.accessToken);
      if (response.status === 200 && response.body) {
        this.statuses = response.body.map(status => status.value);
      } else {
        this.statuses = [];
      }
    } catch (error) {
      console.error('Error during statuses fetch:', error);
      this.success = false;
      this.statuses = [];
    }
  }

  async filterRequests() {
    console.log('Filtering requests:', this.filter);

    if (this.filter.searchPatientName) {
      try {
        const response = await this.service.get(
          this.accessToken,
          this.filter.searchRequestCode,
          this.filter.searchLicenseNumber,
          this.filter.searchPatientName,
          this.filter.searchOperationType,
          this.filter.searchDeadlineDate,
          this.filter.searchPriority,
          this.filter.searchStatus,
        );

        if (response.status === 200 || response.status === 201) {
          console.log("Filtered requests: ", response.body);
          this.filteredRequests = response.body || [];

        } else {
          console.error('Failed to fetch filtered requests:', response.status);
          this.filteredRequests = [];
        }
      } catch (error) {
        console.error('Error during server-side filtering:', error);
        this.filteredRequests = [];
      }
    } else {
      console.log('Filtering locally with requests:', this.requests);

      this.filteredRequests = this.requests.filter(request => {

        const matchesRequestCode =
          !this.filter.searchRequestCode ||
          request.requestCode.toUpperCase().includes(this.filter.searchRequestCode.toUpperCase());
        console.log('Request being checked:', request);
        const matchesLicense =
          !this.filter.searchLicenseNumber ||
          request.staff.toLowerCase().includes(this.filter.searchLicenseNumber.toLowerCase());
        const matchesPatient =
          !this.filter.searchPatientName ||
          request.patient.toLowerCase().includes(this.filter.searchPatientName.toLowerCase());
        const matchesDeadline =
          !this.filter.searchDeadlineDate || request.deadlineDate === this.filter.searchDeadlineDate;

          console.log("request.operationType", request.operationType);
          console.log("this.filter.searchOperationType", this.filter.searchOperationType);  

        // const matchesOperationType =
        //   !this.filter.searchOperationType ||
        //   request.operationType.toLowerCase() === this.filter.searchOperationType.toLowerCase();

        const matchesOperationType =
        !this.filter.searchOperationType ||
        this.operationTypes.some(type =>
          type.Name.toLowerCase() === this.filter.searchOperationType.toLowerCase() &&
          type.OperationTypeCode === request.operationType
        );

          const matchesPriority =
          !this.filter.searchPriority ||
          request.priority.toLowerCase() === this.filter.searchPriority.toLowerCase();
        const matchesStatus =
          !this.filter.searchStatus ||
          request.status.toLowerCase() === this.filter.searchStatus.toLowerCase();

        const result =
          matchesLicense &&
          matchesPatient &&
          matchesDeadline &&
          matchesOperationType &&
          matchesPriority &&
          matchesStatus &&
          matchesRequestCode;

        return result;
      });

      console.log('filtered requests: ', this.filteredRequests);
    }

    this.pages.currentPage = 1;
    this.pages.totalPages = Math.ceil(this.filteredRequests.length / 2);

    this.changePage(this.pages.currentPage);
    
    console.log('Filtered requests for display:', this.filteredRequests);
    this.updateUrlParams(this.filter);
  }

  updateUrlParams(params: any) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params,
      queryParamsHandling: 'merge'
    }).then(r =>
      console.log('Navigated to:', r)
    );
  }
  
  changePage(page: number) {
    const index = (page - 1) * 2;
    this.displayRequests = this.filteredRequests.slice(index, index + 2);

    console.log("Request Displayed: ", this.displayRequests);

    this.pages.currentPage = page;

    this.updateUrlParams({pageNumber: this.pages.currentPage});
  }

  navigateTo(route: string, options?: { queryParams?: any }) {
    this.router.navigate([route], {
      relativeTo: this.route,
      queryParams: options?.queryParams
    }).then(r => console.log('Navigated to:', r));
  }

  navigateToWith(route: string, request: OperationRequest) {
    console.log('Navigating to:', route, " with request:" , request);
    this.updateRequestEvent.emit(request);
    this.navigateTo(route);
  }


  clear() {
    this.filter = {
      searchRequestCode: '',
      searchLicenseNumber: '',
      searchPatientName: '',
      searchOperationType: '',
      searchDeadlineDate: '',
      searchPriority: '',
      searchStatus: '',
    };
        
    this.filteredRequests = [...this.requests];
    this.displayRequests = [];
    this.pages.currentPage = 1;
    this.pages.totalPages = Math.ceil(this.requests.length / 2);
    console.log('Clearing filter:', this.filter);
    this.changePage(this.pages.currentPage);
  }

}
