import {Component, OnInit, Output} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {OperationRequest} from '../../../models/operation-request.model';
import {Router, ActivatedRoute, RouterOutlet} from '@angular/router';
import {OperationRequestsTableComponent} from '../operation-requests-table/operation-requests-table.component';
import {CreateOperationRequestComponent} from '../create-operation-requests/create-operation-requests.component';
import {OperationRequestsService} from '../../../services/operation-requests/operation-requests.service';
import {AuthService} from '../../../services/auth/auth.service';
import {FormsModule} from '@angular/forms';
import {DeleteOperationRequestsComponent} from '../delete-operation-requests/delete-operation-requests.component';
import {UpdateOperationRequestsComponent} from '../update-operation-requests/update-operation-requests.component';
import {StaffsService} from '../../../services/staffs/staffs.service';

@Component({
  selector: 'app-operation-requests',
  imports: [
    NgIf,
    RouterOutlet,
    NgForOf,
    FormsModule,
    OperationRequestsTableComponent,
    CreateOperationRequestComponent,
    DeleteOperationRequestsComponent,
    UpdateOperationRequestsComponent
  ],
  templateUrl: './operation-requests.component.html',
  styleUrls: ['./operation-requests.component.css'],
  standalone: true
})
export class OperationRequestsComponent implements OnInit {
  @Output() requests!: OperationRequest[];
  @Output() selectedRequestToUpdate!: OperationRequest;
  @Output() selectedRequestToDelete!: OperationRequest;
  @Output() selectedRequestToCreate!: OperationRequest;
  @Output() url: string | undefined;

  constructor(
    private service: OperationRequestsService,
    private serviceStaff: StaffsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  priorities: string[] = [];
  statuses: string[] = [];

  accessToken: string = '';
  message = '';
  success = false;

  isCreateModalOpen = false;
  isDeleteModalOpen = false;
  isUpdateModalOpen = false;

  staffFilter = {
    pageNumber: 1,
    name: '',
    email: '',
    specialization: ''
  }

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    console.log("Access token:", this.accessToken);

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

    try {
      await this.loadInitialData();
      console.log('All data loaded successfully.');
    } catch (error) {
      console.error('Error during initialization:', error);
    }
  }

  async loadInitialData() {
    await Promise.all([
      this.loadOperationRequests(),
      this.loadPriority(),
      this.loadRequestStatus()
    ]);
  }

  async loadOperationRequests() {
    try {
      const response = await this.service.getAll(this.accessToken);
      this.requests = response.body || [];
      this.success = true;
      this.message = 'Operation Requests loaded!';
      console.log('Operation Requests:', this.requests);
    } catch (error) {
      console.error('Error loading operation requests:', error);
      this.success = false;
    }
  }

  async loadPriority() {
    try {
      const response = await this.service.getPriority(this.accessToken);
      this.priorities = response.body || [];
      this.success = true;
      this.message = 'Priorities loaded!';
    } catch (error) {
      console.error('Error loading priorities:', error);
      this.success = false;
    }
  }

  async loadRequestStatus() {
    try {
      const response = await this.service.getRequestStatus(this.accessToken);
      this.statuses = response.body.map(status => status.value) || [];
      this.success = true;
      this.message = 'Request Status loaded!';
    } catch (error) {
      console.error('Error loading request statuses:', error);
      this.success = false;
    }
  }

  openCreateModal() {
    console.log('Opening create modal...');
    this.isCreateModalOpen = true;
    this.selectedRequestToCreate = {
      id: '',
      staff: '',
      patient: '',
      operationType: '',
      deadlineDate: '',
      priority: '',
      status: '',
      requestCode: ''
    }
    this.navigateTo('create', { queryParams: { request: JSON.stringify(this.selectedRequestToCreate) } });
  }

  openDeleteModal(request: OperationRequest) {
    console.log('Opening delete modal...');

    this.selectedRequestToDelete = request;

    this.isDeleteModalOpen = true;
    this.navigateTo('delete', { queryParams: { id: JSON.stringify(this.selectedRequestToDelete.id) } });
  }

  openUpdateModal(request: OperationRequest) {
    console.log('Opening update modal...');

    this.selectedRequestToUpdate = request;

    this.isUpdateModalOpen = true;
    this.navigateTo('update', { queryParams: { id: JSON.stringify(this.selectedRequestToUpdate.id) } });
  }

  closeCreateModal() {
    console.log('Creating request:', this.selectedRequestToCreate);
    console.log("Closing create modal...");
    this.isCreateModalOpen = false;
    this.navigateToOperationRequestManager();
  }

  closeDeleteModal() {
    this.selectedRequestToDelete = {
      id: '',
      staff: '',
      patient: '',
      operationType: '',
      deadlineDate: '',
      priority: '',
      status: '',
      requestCode: ''
    };

    this.isDeleteModalOpen = false;
    this.navigateToOperationRequestManager();
  }

  closeUpdateModal() {
    this.selectedRequestToUpdate = {
      id: '',
      staff: '',
      patient: '',
      operationType: '',
      deadlineDate: '',
      priority: '',
      status: '',
      requestCode: ''
    };

    this.isUpdateModalOpen = false;
    this.navigateToOperationRequestManager();
  }

  async createRequest(request: OperationRequest) {
    console.log('Creating request:', request);

    this.selectedRequestToCreate = request;

    // Extract email and validate
    this.staffFilter.email = this.authService.extractEmailFromAccessToken(this.accessToken) as string;
    // this.staffFilter.email = 'staff@email';
    console.log(this.staffFilter.email)
    if (!this.staffFilter.email) {
      throw new Error('Error extracting email from access token');
    }

    try {
      // Await the asynchronous getStaff call
      const staffResponse = await this.serviceStaff.getStaff(this.staffFilter, this.accessToken);
      console.log(staffResponse);

      if (staffResponse.status === 200) {
        this.selectedRequestToCreate.staff = staffResponse.body.staffs[0].licenseNumber;
        console.log('Staff obtained:', this.selectedRequestToCreate.staff);
      } else {
        console.log(`Unexpected response status: ${staffResponse.status}`);
      }

      console.log('Calling post with DTO:', {
        staff: this.selectedRequestToCreate.staff,
        patient: this.selectedRequestToCreate.patient,
        operationType: this.selectedRequestToCreate.operationType,
        deadlineDate: this.selectedRequestToCreate.deadlineDate,
        priority: this.selectedRequestToCreate.priority,
      });

      await this.service.post(
        this.accessToken,
        this.selectedRequestToCreate.staff,
        this.selectedRequestToCreate.patient,
        this.selectedRequestToCreate.operationType,
        this.selectedRequestToCreate.deadlineDate,
        this.selectedRequestToCreate.priority,
      ).then(
        response => {
          if(response.status === 201) {
            this.message = 'Request created successfully!';
            this.success = true;
          }

          else {
            console.error('Error creating request:', response);
            this.message = 'Failed to create the request.';
            this.success = false;
          }

          console.log(this.message);

        }
      )

      if(this.success) {
        await this.loadOperationRequests();
      }


    } catch (error) {
      console.error('Error creating request:', error);
      this.message = 'Failed to create the request.';
      this.success = false;
    } finally {
      if(this.success) this.closeCreateModal();
      else console.error("Failed to create request");
    }
  }

  async deleteRequest(request: OperationRequest) {
    console.log('Deleting request:', request);

    this.selectedRequestToDelete = request;

    try {
      await this.service.delete(this.accessToken, this.selectedRequestToDelete.id);

      await this.loadOperationRequests();

      this.message = 'Request deleted successfully!';
      this.success = true;
    } catch (error) {
      console.error('Error deleting request:', error);
      this.message = 'Failed to delete the request.';
      this.success = false;
    } finally {
      this.closeDeleteModal(); // Always close the modal
    }
  }

  async updateRequest(request: OperationRequest) {
    // try {
    //   console.log('Updating request:', request);
    //
    //   await this.service.put(
    //     this.accessToken,
    //     this.selectedRequestToUpdate.id,
    //     this.selectedRequestToUpdate.deadlineDate,
    //     this.selectedRequestToUpdate.priority,
    //     this.selectedRequestToUpdate.status,
    //   );
    //
    //   await this.loadOperationRequests();
    //
    //   this.message = 'Request updated successfully!';
    //   this.success = true;
    // } catch (error) {
    //   console.error('Error updating request:', error);
    //   this.message = 'Failed to update the request.';
    //   this.success = false;
    // }

    console.log('Updating request:', request);
  }

  navigateToDoctorMenu() {
    this.router.navigate(['doctor']).then(r => console.log('Navigated to doctor menu:', r));
  }

  navigateToOperationRequestManager() {
    this.router.navigate(['doctor/operation-requests']).then(r => console.log('Navigated to operation requests:', r));
  }

  navigateTo(route: string, options?: { queryParams?: any }) {
    this.router
      .navigate([route], {
        relativeTo: this.route,
        queryParams: options?.queryParams,
      })
      .then(r => console.log('Navigated to:', r))
      .catch(err => console.error('Navigation Error:', err));
  }
}
