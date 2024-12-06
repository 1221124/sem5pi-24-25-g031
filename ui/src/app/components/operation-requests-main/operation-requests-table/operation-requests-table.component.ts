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

  @Output() updateRequestEvent = new EventEmitter<OperationRequest>();
  @Output() deleteRequestEvent = new EventEmitter<OperationRequest>();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: OperationRequestsService,
    private operationTypesService: OperationTypesService,
    private authService: AuthService
  ) {
  }

  selectedRequest!: OperationRequest;

  operationTypes: OperationType[] = [];
  priorities: string[] = [];
  statuses: string[] = [];

  filteredRequests: OperationRequest[] = [];

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

  async ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    console.log('Requests:', this.requests);


    await this.initialData();

    if (!this.requests) {
      this.requests = [];
    }

    this.filteredRequests = [...this.requests];

    this.pages.totalPages = Math.ceil(this.requests.length / 2);
    this.requests = this.requests.slice(0, 2);
  }

  async initialData() {
    const emptyFilter = {
      pageNumber: 0
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

          if (response.status === 200 || response.status === 201) {
            if (response.body) {
              this.operationTypes = response.body.operationTypes.map(operationType => {
                return {
                  ...operationType,
                  name: operationType.Name.Value,
                  specialization: operationType.Specialization
                }
              }) || [];
            }
          } else {
            console.error('Failed to fetch operation types:', response.status);
            this.operationTypes = [];
          }
    } catch (error) {
      console.error('Error during operation types fetch:', error);
      this.operationTypes = [];
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
          request.requestCode.toLowerCase().includes(this.filter.searchRequestCode.toLowerCase());
        console.log('Request being checked:', request);
        const matchesLicense =
          !this.filter.searchLicenseNumber ||
          request.staff.toLowerCase().includes(this.filter.searchLicenseNumber.toLowerCase());
        const matchesPatient =
          !this.filter.searchPatientName ||
          request.patient.toLowerCase().includes(this.filter.searchPatientName.toLowerCase());
        const matchesDeadline =
          !this.filter.searchDeadlineDate || request.deadlineDate === this.filter.searchDeadlineDate;
        const matchesOperationType =
          !this.filter.searchOperationType ||
          request.operationType.toLowerCase() === this.filter.searchOperationType.toLowerCase();
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

        console.log(`
        matchesRequestCode: ${matchesRequestCode}
        matchesLicense: ${matchesLicense},
        matchesPatient: ${matchesPatient},
        matchesDeadline: ${matchesDeadline},
        matchesOperationType: ${matchesOperationType},
        matchesPriority: ${matchesPriority},
        matchesStatus: ${matchesStatus},
        Filter result: ${result}
      `);

        return result;
      });

      console.log('filtered requests: ', this.filteredRequests);
    }

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

  navigateTo(route: string, options?: { queryParams?: any }) {
    this.router.navigate([route], {
      relativeTo: this.route,
      queryParams: options?.queryParams
    }).then(r => console.log('Navigated to:', r));
  }

  navigateToWith(route: string, request: OperationRequest) {
    this.updateRequestEvent.emit(request);
    this.navigateTo(route);
  }

  changePage(page: number) {
    const index = (page - 1) * 2;
    this.requests = this.requests.slice(index, index + 2);

    this.pages.currentPage = page;

    this.updateUrlParams({pageNumber: page});
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

    this.pages.currentPage = 1;

    this.filteredRequests = [...this.requests];

    this.updateUrlParams(this.filter); // Clear filters from URL
  }

}
