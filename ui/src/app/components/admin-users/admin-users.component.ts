import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { AdminUsersService } from '../../services/admin-users/admin-users.service';
import { Staff } from '../../models/staff.model';
import { CommonModule, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css'],
  imports: [CommonModule, NgIf, NgForOf]
})
export class AdminUsersComponent implements OnInit {
  staff: Staff = {
    Id: '',
    FullName: {
      FirstName: '',
      LastName: ''
    },
    licenseNumber: '',
    specialization: '',
    staffRole: '',
    ContactInformation: {
      Email: '',
      PhoneNumber: ''
    },
    status: '',
    SlotAppointment: [
      {
        Start: '',
        End: ''
      }
    ],
    SlotAvailability: [
      {
        Start: '',
        End: ''
      }
    ]
  };

  staffs: Staff[] = [];
  accessToken: string = '';

  message: string = '';
  isError: boolean = false;

  filter = {
    pageNumber: 1
  };
  totalItems: number = 0;
  totalPages: number = 1;

  constructor(private authService: AuthService, private userService: AdminUsersService, private router: Router) {}

  async ngOnInit() {
    this.authService.message$.subscribe((newMessage) => {
      this.message = newMessage;  
    });
    this.authService.isError$.subscribe((errorStatus) => {
      this.isError = errorStatus;  
    });
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage(
        'You are not authenticated or authorized! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    this.accessToken = this.authService.getToken();
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or authorized! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
    
    this.fetchStaffs();
  }

  async fetchStaffs() {
    await this.userService.getStaff(this.filter, this.accessToken)
    .then(response => {
      if (response.status === 200) {
        if (response.body) {
          this.staffs = response.body.staffs;
          this.totalItems = response.body.totalItems || 0;
          this.totalPages = Math.ceil(this.totalItems / 2);
        } else {
          this.staffs = [];
          this.authService.updateMessage('Unexpected response body: ' + response.body);
          this.authService.updateIsError(true);
          this.totalItems = 0;
          this.totalPages = 1;
        }
      } else {
        this.staffs = [];
        this.authService.updateMessage('Unexpected response status: ' + response.status);
        this.authService.updateIsError(true);
        this.totalItems = 0;
        this.totalPages = 1;
      }
    }).catch(error => {
      if (error.status === 404) {
        this.staffs = [];
        this.authService.updateMessage('No staff found!');
        this.authService.updateIsError(true);
        this.totalItems = 0;
        this.totalPages = 1;
      } else if (error.status === 401) {
        this.authService.updateMessage('You are not authenticated or authorized! Redirecting to login...');
        this.authService.updateIsError(true);
        this.totalItems = 0;
        this.totalPages = 1;
        setTimeout(() => {
          this.router.navigate(['']);
        }, 3000);
        return;
      } else {
        this.staffs = [];
        this.authService.updateMessage('Unexpected error: ' + error);
        this.authService.updateIsError(true);
        this.totalItems = 0;
        this.totalPages = 1;
      }
    });
  }

  async createUser(staff: Staff) {
    try {
      const response = await this.authService.createUser(
        staff.ContactInformation.Email,
        staff.staffRole,
        this.accessToken
      );
      if (response?.status === 201) {
        this.authService.updateMessage('User created successfully');
        this.authService.updateIsError(false);
        setTimeout(() => {
          this.fetchStaffs();
        }, 2000);
      } else {
        this.authService.updateMessage(
          `Failed to create user. Status: ${response?.status}`
        );
        this.authService.updateIsError(true);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }

  async changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      await this.fetchStaffs();
    }
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
}