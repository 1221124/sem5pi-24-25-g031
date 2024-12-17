import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Appointment } from '../../../models/appointment.model';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [NgIf, NgForOf, FormsModule, CommonModule],
  templateUrl: './appointments-list.component.html',
  styleUrls: ['./appointments-list.component.css']
})
export class AppointmentsListComponent implements OnInit {
  @Input() appointments: Appointment[] = [];
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 1;
  @Input() isDoctor: boolean = false;
  @Input() filter: { surgeryRoomNumber: string, date: string, staff: string, patient: string } = { surgeryRoomNumber: '', date: '', staff: '', patient: '' };
  @Output() edit = new EventEmitter<Appointment>();
  @Output() delete = new EventEmitter<Appointment>();
  @Output() filterChange = new EventEmitter<{ surgeryRoomNumber: string, date: string, staff: string, patient: string }>();

  accessToken = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin or a doctor! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')
    && !this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage('You are not authenticated or are not an admin or a doctor! Redirecting to login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }
  }

  onFilterChange() {
    this.currentPage = 1;

    this.updateQueryParams();
    this.filterChange.emit(this.filter);
  }

  resetFilters() {
    this.filter = {
      surgeryRoomNumber: '',
      date: '',
      staff: '',
      patient: ''
    };
  
    this.updateQueryParams();
  }

  updateQueryParams() {
    const queryParams: any = {};
    const currentRoute = this.router.url;

    if (currentRoute.includes('create') || currentRoute.includes('update')) {
      return;
    }
  
    if (this.filter.surgeryRoomNumber) {
      queryParams['surgeryRoomNumber'] = this.filter.surgeryRoomNumber;
    }
    if (this.filter.date) {
      queryParams['date'] = this.filter.date;
    }
    if (this.filter.staff) {
      queryParams['staff'] = this.filter.staff;
    }
    if (this.filter.patient) {
      queryParams['patient'] = this.filter.patient;
    }
  
    if (this.currentPage) {
      queryParams['page'] = this.currentPage.toString();
    }
  
    this.router.navigate(['/appointments'], { queryParams });
  }

  getPaginatedAppointments(): Appointment[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.appointments.slice(start, start + this.itemsPerPage);
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