import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { OperationType } from '../../../models/operation-type.model';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationTypesFormComponent } from '../operation-types-form/operation-types-form.component';
import { OperationTypesListComponent } from '../operation-types-list/operation-types-list.component';
import { ToggleOperationTypeStatusComponent } from '../toggle-operation-type-status/toggle-operation-type-status.component';
import { EnumsService } from '../../../services/enums/enums.service';
@Component({
  selector: 'app-operation-types',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    CommonModule,
    RouterOutlet,
    OperationTypesFormComponent,
    OperationTypesListComponent,
    ToggleOperationTypeStatusComponent
  ],
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.css'],
})
export class OperationTypesComponent implements OnInit {
  accessToken: string = '';
  showList : boolean = false;
  showForm : boolean = false;
  selectedOperationType: OperationType | null = null;
  operationTypes: OperationType[] = [];
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 1;
  itemsPerPage = 1;
  filter = {
    name: '',
    status: '',
    specialization: ''
  };

  roles: string[] = [];
  specializations: string[] = [];
  statuses: string[] = [];

  constructor(
    private service: OperationTypesService,
    private authService: AuthService,
    private enumsService: EnumsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    await this.loadEnums();
    await this.loadOperationTypes();

    this.initializeRoute();
  }

  initializeRoute() {
    this.route.queryParams.subscribe((params) => {
      if (params['name']) {
        this.filter.name = params['name'];
      } else {
        this.filter.name = '';
      }
      if (params['specialization']) {
        this.filter.specialization = params['specialization'];
      } else {
        this.filter.specialization = '';
      }
      if (params['status']) {
        this.filter.status = params['status'];
      } else {
        this.filter.status = '';
      }
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }
    });

    if (this.router.url.includes('create')) {
      this.showOperationTypesForm();
    } else if (this.router.url.includes('update')) {
      this.route.queryParams.subscribe((params) => {
        const code = params['code'];
        if (code) {
          this.selectedOperationType = this.operationTypes.find((ot) => ot.OperationTypeCode === code) || null;
          if (this.selectedOperationType) {
            this.showOperationTypesForm();
          }
        }
      });
    } else {
      this.showOperationTypesList();
    }
  }

  backToAdmin() {
    this.router.navigate(['/admin']);
  }

  async loadEnums() {
    this.roles = await this.enumsService.getStaffRoles(this.accessToken);
    this.specializations = await this.enumsService.getSpecializations(this.accessToken);
    this.statuses = await this.enumsService.getStatuses(this.accessToken);
  }

  async loadOperationTypes() {
    try {
      await this.service.getOperationTypes(this.filter, this.accessToken).then(
        (response) => {
          this.operationTypes = response.body?.operationTypes || [];
          this.operationTypes.sort((a, b) => a.OperationTypeCode.localeCompare(b.OperationTypeCode));
          if (this.filter.name) {
            this.operationTypes = this.operationTypes.filter((ot) =>
              ot.Name.toLowerCase().includes(this.filter.name.toLowerCase())
            );
          }
        }
      );
      this.totalItems = this.operationTypes.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    } catch (error) {
      console.error('Error loading operation types:', error);
    }
  }

  async showOperationTypesList() {
    this.showForm = false;
    this.showList = true;
    this.router.navigate(['/admin/operationTypes'], { 
      queryParams: { page: 1 }}
    );
    this.selectedOperationType = null;
    this.filter.name = '';
    this.filter.status = '';
    this.filter.specialization = '';
    await this.loadOperationTypes();
  }

  async showOperationTypesForm() {
    this.showList = false;
    this.showForm = true;
    if (this.selectedOperationType) {
      this.router.navigate(['/admin/operationTypes/update'], {
        queryParams: { code: this.selectedOperationType.OperationTypeCode }
      });
    } else {
      this.router.navigate(['/admin/operationTypes/create']);
    }
  }

  onStatusToggle(operationType: OperationType) {
    this.selectedOperationType = operationType;
  }

  async onStatusToggled() {
    await this.showOperationTypesList();
  }

  async onFilterChange(filters: { name: string; status: string; specialization: string }) {
    this.filter.name = filters.name;
    this.filter.status = filters.status;
    this.filter.specialization = filters.specialization;
    await this.loadOperationTypes();
  }

  async onSubmit() {
    await this.showOperationTypesList();
  }

  async onEdit(operationType: OperationType) {
    this.selectedOperationType = operationType;
    await this.showOperationTypesForm();
  }

  async onCancel() {
    await this.showOperationTypesList();
  }
}