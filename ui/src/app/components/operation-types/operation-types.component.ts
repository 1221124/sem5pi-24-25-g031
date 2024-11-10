import { Component, OnInit } from '@angular/core';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

export interface OperationType {
  Id: string;
  Name: string;
  Specialization: string;
  RequiredStaff: {
    Role: string;
    Specialization: string;
    Quantity: number;
  }[];
  PhasesDuration: {
    Preparation: number;
    Surgery: number;
    Cleaning: number;
  };
  Status: string;
}

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
  editingOperationType: OperationType | null = null;
  isEditMode: boolean = false;

  constructor(private operationTypesService: OperationTypesService) {}

  ngOnInit() {
    this.operationTypesService.getStaffRoles().then((data) => {
      this.roles = data;
    });
    this.operationTypesService.getSpecializations().then((data) => {
      this.specializations = data;
    });
    this.operationTypesService.getStatuses().then((data) => {
      this.statuses = data;
    });
    this.fetchOperationTypes();
  }

  fetchOperationTypes(): void {
    this.operationTypesService.getOperationTypes(this.filter)
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
      } else if (response.status === 404) {
        this.operationTypes = [];
        this.message = 'No Operation Types found!';
        this.success = true;
        this.totalItems = 0;
        this.totalPages = 1;
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
        this.success = true;
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

  applyFilter(): void {
    this.filter = {
      pageNumber: 1,
      name: this.filter.name,
      specialization: this.filter.specialization,
      status: this.filter.status
    };
    this.fetchOperationTypes();
  }

  clearFilters(): void {
    this.filter = {
      pageNumber: 1,
      name: '',
      specialization: '',
      status: ''
    };
    this.fetchOperationTypes();
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

  startEditOperationType(operationType: OperationType): void {
    this.editingOperationType = { ...operationType };
    this.isEditMode = true;
    this.showCreateForm = true;
  }

  submitOperationType() {
    if (this.isEditMode) {
      this.update(this.operationType.Id);
    } else {
      this.operationTypesService.post(this.operationType)
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

  changePage(pageNumber: number): void {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      this.fetchOperationTypes();
    }
  }

  update(id: string): void {
    if (this.editingOperationType) {
      this.operationTypesService.updateOperationType(id, this.editingOperationType)
        .then(response => {
          if (response.status === 200) {
            this.message = 'Operation Type successfully updated!';
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
          this.message = 'There was an error updating the Operation Type: ' + error;
          this.success = false;
      });
    }
  }

  delete(id: string): void {
    this.operationTypesService.deleteOperationType(id)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Operation Type successfully deleted!';
          this.success = true;
          this.fetchOperationTypes();
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        this.message = 'There was an error deleting the Operation Type: ' + error;
        this.success = false;
      });
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
    this.editingOperationType = null;
    this.isEditMode = false;
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
}