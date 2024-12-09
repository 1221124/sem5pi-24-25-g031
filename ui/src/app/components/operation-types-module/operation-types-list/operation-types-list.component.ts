import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OperationType } from '../../../models/operation-type.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-operation-types-list',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule, CommonModule],
  templateUrl: './operation-types-list.component.html',
  styleUrls: ['./operation-types-list.component.css']
})
export class OperationTypesListComponent implements OnInit {
  @Input() operationTypes: OperationType[] = [];
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() specializations: string[] = [];
  @Input() statuses: string[] = [];
  @Input() filter: { name: string, specialization: string, status: string } = { name: '', specialization: '', status: '' };
  @Output() edit = new EventEmitter<OperationType>();
  @Output() statusToggle = new EventEmitter<OperationType>();
  @Output() filterChange = new EventEmitter<{ name:string, specialization: string, status: string }>();

  itemsPerPage = 2;

  accessToken = '';

  constructor(
    private authService: AuthService,
    private router: Router
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
      this.authService.updateMessage('You are not authenticated or are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }
  }

  onStatusToggle(operationType: OperationType) {
    this.statusToggle.emit(operationType);
  }

  onFilterChange() {
    this.currentPage = 1;

    if (this.filter.specialization == 'All Specializations') this.filter.specialization = '';
    if (this.filter.status == 'All Statuses') this.filter.status = '';

    this.updateQueryParams();
    this.filterChange.emit(this.filter);
  }

  resetFilters() {
    this.filter = {
      name: '',
      specialization: '',
      status: ''
    };
  
    this.updateQueryParams();
  }

  updateQueryParams() {
    const queryParams: any = {};
    const currentRoute = this.router.url;

    if (currentRoute.includes('create') || currentRoute.includes('update')) {
      return;
    }
  
    if (this.filter.name) {
      queryParams['name'] = this.filter.name;
    }
    if (this.filter.specialization) {
      queryParams['specialization'] = this.filter.specialization;
    }
    if (this.filter.status) {
      queryParams['status'] = this.filter.status;
    }
  
    if (this.currentPage) {
      queryParams['page'] = this.currentPage.toString();
    }
  
    this.router.navigate(['/admin/operationTypes'], { queryParams });
  }

  getPaginatedOperationTypes(): OperationType[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.operationTypes.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage++;
    }
    this.updateQueryParams();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.updateQueryParams();
  }
}