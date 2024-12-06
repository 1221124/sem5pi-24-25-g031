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

  async createRequest(request: OperationRequest){
    console.log('Creating request:', request);
  }

  async deleteRequest(request: OperationRequest) {
    try {
      console.log('Deleting request:', request);

      await this.service.delete(this.selectedRequestToDelete.id, this.accessToken);

      await this.loadOperationRequests();

      this.message = 'Request deleted successfully!';
      this.success = true;
    } catch (error) {
      console.error('Error deleting request:', error);
      this.message = 'Failed to delete the request.';
      this.success = false;
    } finally {
      this.closeDeleteModal(); // Close the modal in both success and error cases
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
