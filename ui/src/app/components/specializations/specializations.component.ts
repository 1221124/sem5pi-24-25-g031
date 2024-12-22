import {Component, Output} from '@angular/core';
import {StaffsService} from '../../services/staffs/staffs.service';
import {AuthService} from '../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Staff} from '../../models/staff.model';
import { ListSpecializationComponent } from './list-specialization/list-specialization.component';
import { AddSpecializationComponent } from './add-specialization/add-specialization.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-specializations',
  standalone: true,
  imports: [ListSpecializationComponent, AddSpecializationComponent, CommonModule, FormsModule],
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css'
})
export class SpecializationsComponent {
  @Output() selectedSpecializationToCreate;

  isCreateModalOpen = false;
  closeModal() {
    this.isCreateModalOpen = false;
  }

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  openModal() {
    console.log('Opening create modal...');

    this.isCreateModalOpen = true;

    this.navigateTo('create', { queryParams: { request: JSON.stringify(this.selectedSpecializationToCreate) } });
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
