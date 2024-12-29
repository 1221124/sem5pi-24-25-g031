import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {OperationType} from '../../../models/operation-type.model';
import {Specialization} from '../../../models/specialization.model';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {Staff} from '../../../models/staff.model';

@Component({
  selector: 'app-list-specialization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-specialization.component.html',
  styleUrl: './list-specialization.component.css'
})
export class ListSpecializationComponent implements OnInit {
  @Input() specializations: Specialization[] = [];
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 5;
  @Output() updateSpecializationEvent = new EventEmitter<Specialization>();

  accessToken = '';

  filters = {
    code: '',
    name: '',
    description: ''
  };

  filteredSpecializations = [...this.specializations];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }
  }

  getPaginatedSpecializations() : Specialization[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.specializations.slice(start, start + this.itemsPerPage);
  }

  applyFiltrer() {
    this.filteredSpecializations = this.specializations.filter(specialization => {
      const matchesCode = this.filters.code
        ? specialization.SNOMEDCTCode === this.filters.code
        : true;
      const matchesName = this.filters.name
        ? specialization.Name.toLowerCase().includes(this.filters.name.toLowerCase())
        : true;
      const matchesDescription = this.filters.description
        ? specialization.Description.toLowerCase().includes(this.filters.description.toLowerCase())
        : true;

      return matchesCode && matchesName && matchesDescription;
    });
  }

  clearFilters() {
    this.filters = { code: '', name: '', description: '' };
    this.filteredSpecializations = [...this.specializations];
  }
}
