import { CommonModule } from '@angular/common';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {OperationType} from '../../../models/operation-type.model';
import {Specialization} from '../../../models/specialization.model';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';
import {Staff} from '../../../models/staff.model';
import {filter} from 'rxjs';

@Component({
  selector: 'app-list-specialization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list-specialization.component.html',
  styleUrl: './list-specialization.component.css'
})
export class ListSpecializationComponent implements OnInit {
  @Input() specializations: Specialization[] = [];
  /*@Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 5;*/
  @Output() updateSpecializationEvent = new EventEmitter<Specialization>();

  accessToken = '';

  filter = {
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

  getPaginatedSpecializations() {
    return this.specializations.filter(specialization => {
      return (
        (this.filter.code ? specialization.SNOMEDCTCode.includes(this.filter.code) : true) &&
        (this.filter.name ? specialization.Name.toLowerCase().includes(this.filter.name.toLowerCase()) : true) &&
        (this.filter.description ? specialization.Description.toLowerCase().includes(this.filter.description.toLowerCase()) : true)
      );
    });
  }

  applyFiltrer() {
    this.getPaginatedSpecializations();
  }

  clearFilters() {
    this.filter = { code: '', name: '', description: '' };
    this.filteredSpecializations = [...this.specializations];
  }

}
