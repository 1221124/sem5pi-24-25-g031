import { CommonModule } from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {OperationType} from '../../../models/operation-type.model';
import {Specialization} from '../../../models/specialization.model';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

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
  @Input() itemsPerPage: number = 1;
  accessToken = '';

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
}
