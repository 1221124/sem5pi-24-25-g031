import { Component, OnInit } from '@angular/core';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { OperationType } from '../../models/operation-type.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-operation-types',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf],
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.css']
})
export class OperationTypesComponent implements OnInit {
  operationType: OperationType = {
    Id: '',
    Name: '',
    Specialization: '',
    RequiredStaff: [],
    PhasesDuration: {
      Preparation: 0,
      Surgery: 0,
      Cleaning: 0
    },
    Status: ''
  };

  newStaff: {
    Role: string;
    Specialization: string;
    Quantity: number;
  } = {
    Role: '',
    Specialization: '',
    Quantity: 1
  };

  operationTypes: OperationType[] = [];
  roles: string[] = [];
  specializations: string[] = [];
  statuses: string[] = [];

  filter = {
    pageNumber: 1,
    name: '',
    specialization: '',
    status: ''
  }
  totalItems: number = 0;
  totalPages: number = 1;

  message: string = '';
  success: boolean = true;
  showCreateForm: boolean = false;
  isEditMode: boolean = false;

  accessToken : string = '';

  constructor(private authService: AuthService, private operationTypesService: OperationTypesService, private router: Router) {}

  async ngOnInit() {
    await this.operationTypesService.getStaffRoles().then((data) => {
      this.roles = data;
    });
    await this.operationTypesService.getSpecializations().then((data) => {
      this.specializations = data;
    });
    await this.operationTypesService.getStatuses().then((data) => {
      this.statuses = data;
    });
    this.accessToken = this.authService.getToken() as string;
    await this.fetchOperationTypes();
  }

  reloadPage() {
    window.location.reload();
  }

  async fetchOperationTypes() {
    await this.operationTypesService.getOperationTypes(this.filter, this.accessToken)
    .then(response => {
      if (response.status === 200) {
        if (response.body) {
          this.operationTypes = response.body.operationTypes;
          this.totalItems = response.body.totalItems || 0;
          this.totalPages = Math.ceil(this.totalItems / 2);
        } else {
          this.operationTypes = [];
          this.message = 'Response body is null: ' + response.body;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      } else {
        this.operationTypes = [];
        this.message = 'Unexpected response status: ' + response.status;
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
      }
    }).catch(error => {
      if (error.status === 404) {
        this.operationTypes = [];
        this.message = 'No Operation Types found!';
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
      } else {
        this.operationTypes = [];
        this.message = 'There was an error fetching the Operation Types: ' + error;
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
      }
    });
  }

  async applyFilter() {
    this.filter = {
      pageNumber: 1,
      name: this.filter.name,
      specialization: this.filter.specialization,
      status: this.filter.status
    };
    await this.fetchOperationTypes();
  }

  async clearFilters() {
    this.filter = {
      pageNumber: 1,
      name: '',
      specialization: '',
      status: ''
    };
    await this.fetchOperationTypes();
  }

  addStaff(): void {
    if (this.newStaff.Role && this.newStaff.Specialization && this.newStaff.Quantity) {
      this.operationType.RequiredStaff.push({ ...this.newStaff });
      this.newStaff = { Role: '', Specialization: '', Quantity: 1 };
    } else {
      this.message = 'Please fill in all fields for the staff';
      this.success = false;
    }
  }

  startEditOperationType(operationType: OperationType, isActivate: boolean): void {
    this.operationType = { ...operationType };
    if (isActivate) {
      this.showCreateForm = false;
      this.operationType.Status = 'Active';
    } else {
      this.showCreateForm = true;
    }
    this.isEditMode = true;
  }

  async submitOperationType() {
    if (this.isEditMode) {
      await this.update(this.operationType.Id);
    } else {
      await this.operationTypesService.post(this.operationType, this.accessToken)
        .then(response => {
          if (response.status === 201) {
            this.message = 'Operation Type successfully created!';
            this.success = true;
            this.clearForm();
            this.showCreateForm = false;
            this.fetchOperationTypes();
          } else {
            this.message = 'Unexpected response status: ' + response.status;
            this.success = false;
          }
        })
        .catch(error => {
          this.message = 'There was an error creating the Operation Type: ' + error;
          this.success = false;
      });
    }
  }

  async changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      await this.fetchOperationTypes();
    }
  }

  async update(id: string) {
    await this.operationTypesService.updateOperationType(id, this.operationType, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Operation Type successfully updated!';
          this.success = true;
          setTimeout(() => {
            this.clearForm();
            this.showCreateForm = false;
          }, 3000);
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        this.message = 'There was an error updating the Operation Type: ' + error;
        this.success = false;
    });
    await this.fetchOperationTypes();
  }

  async activate(operationType: OperationType) {
    this.startEditOperationType(operationType, true);
    await this.update(operationType.Id);
  }

  async inactivate(id: string) {
    await this.operationTypesService.deleteOperationType(id, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Operation Type successfully deleted!';
          this.success = true;
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        this.message = 'There was an error deleting the Operation Type: ' + error;
        this.success = false;
      });
    await this.fetchOperationTypes();
  }

  clearForm(): void {
    this.operationType = {
      Id: '',
      Name: '',
      Specialization: '',
      RequiredStaff: [],
      PhasesDuration: {
        Preparation: 0,
        Surgery: 0,
        Cleaning: 0
      },
      Status: ''
    };
    this.newStaff = { Role: '', Specialization: '', Quantity: 1 };
    this.isEditMode = false;
    this.message = '';
  }

  toggleForm(): void {
    if (this.showCreateForm && this.isEditMode) {
      this.clearForm();
    }
    this.showCreateForm = !this.showCreateForm;
  
    if (!this.showCreateForm) {
      this.clearForm();
    }
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}