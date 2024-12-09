import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  showList = true;
  selectedOperationType: OperationType | null = null;
  operationTypes: OperationType[] = [];
  totalItems: number = 0;
  filter = {
    name: '',
    status: '',
    specialization: '',
  };

  specializations: string[] = [];
  statuses: string[] = [];

  constructor(
    private service: OperationTypesService,
    private authService: AuthService,
    private enumsService: EnumsService,
    private router: Router,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef
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
  }

  async loadEnums() {
    this.specializations = await this.enumsService.getSpecializations(this.accessToken);
    this.statuses = await this.enumsService.getStatuses(this.accessToken);
  }

  async loadOperationTypes() {
    try {
      // this.route.queryParams.subscribe((params) => {
      //   if (params['name']) {
      //     this.filter.name = params['name'];
      //   } else {
      //     this.filter.name = '';
      //   }
      //   if (params['specialization']) {
      //     this.filter.specialization = params['specialization'];
      //   } else {
      //     this.filter.specialization = '';
      //   }
      //   if (params['status']) {
      //     this.filter.status = params['status'];
      //   } else {
      //     this.filter.status = '';
      //   }
      // });
      const response = await this.service.getOperationTypes(this.filter, this.accessToken);
      this.operationTypes = response.body?.operationTypes || [];
      this.totalItems = response.body?.totalItems || 0;
      this.operationTypes.sort((a, b) => a.OperationTypeCode.localeCompare(b.OperationTypeCode));
      this.cdRef.detectChanges();
    } catch (error) {
      console.error('Error loading operation types:', error);
    }
  }

  async toggleView() {
    await this.loadOperationTypes();
    this.showList = !this.showList;
    this.selectedOperationType = null;
    if (this.showList) {
      this.router.navigate(['/admin/operationTypes'], { replaceUrl: true });
    } else {
      this.router.navigate(['/admin/operationTypes/create'], { replaceUrl: true });
    }
  }

  async onEdit(operationType: OperationType) {
    this.selectedOperationType = operationType;
    this.showList = false;
    this.router.navigate(['/admin/operationTypes/update'], {
      queryParams: { code: operationType.OperationTypeCode },
      replaceUrl: true,
    });
  }

  onStatusToggle(operationType: OperationType) {
    this.selectedOperationType = operationType;
  }

  async onStatusToggled() {
    this.showList = false;
    await this.toggleView();
  }

  async onFilterChange(filters: { name: string; status: string; specialization: string }) {
    this.filter.name = filters.name;
    this.filter.status = filters.status;
    this.filter.specialization = filters.specialization;
    await this.loadOperationTypes();
  }

  async onSubmit() {
    await this.loadOperationTypes();
    await this.toggleView();
  }

  onCancel() {
    this.toggleView();
  }
}