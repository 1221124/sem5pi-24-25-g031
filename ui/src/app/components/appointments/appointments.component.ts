import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { AppointmentsService } from '../../services/appointments/appointments.service';
import { Router } from '@angular/router';
import { Appointment } from '../../models/appointment';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent {

  appointments: Appointment[] = [];
  
  filter = {
    pageNumber: 1
  }
  totalItems: number = 0;
  totalPages: number = 1;

  message: string = '';
  success: boolean = true;

  accessToken : string = '';

  constructor(private authService: AuthService, private appointmentsService: AppointmentsService, private router: Router) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    await this.fetchAppointments();
  }

  async fetchAppointments() {
    await this.appointmentsService.getAll(this.filter, this.accessToken)
    .then(response => {
      if (response.status === 200) {
        if (response.body) {
          this.appointments = response.body.appointments;
          this.totalItems = response.body.totalItems || 0;
          this.totalPages = Math.ceil(this.totalItems / 2);
        } else {
          this.appointments = [];
          this.message = 'Response body is null: ' + response.body;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      } else {
        this.appointments = [];
        this.message = 'Unexpected response status: ' + response.status;
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
      }
    }).catch(error => {
      if (error.status === 404) {
        this.appointments = [];
        this.message = 'No Appointments found!';
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
      } else if (error.status === 401) {
        this.message = 'You are not authorized to view Appointments! Please log in...';
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);
        return;
      } else {
        this.appointments = [];
        this.message = 'There was an error fetching the Appointments: ' + error;
        this.success = false;
        this.totalItems = 0;
        this.totalPages = 1;
      }
    });
  }

  // async applyFilter() {
  //   this.filter = {
  //     pageNumber: 1
  //   };
  //   await this.fetchAppointments();
  // }

  // async clearFilters() {
  //   this.filter = {
  //     pageNumber: 1
  //   };
  //   await this.fetchAppointments();
  // }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  async changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      await this.fetchAppointments();
    }
  }
}