import { CommonModule, NgIf, NgForOf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AppointmentsService } from '../../../services/appointments/appointments.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Appointment } from '../../../models/appointment';
import { OperationRequestsService } from '../../../services/operation-requests/operation-requests.service';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf, RouterOutlet],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  accessToken: string = '';
  showList : boolean = false;
  showForm : boolean = false;
  selectedAppointment: Appointment | null = null;
  appointments: Appointment[] = [];
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 1;
  itemsPerPage = 2;
  filter = {
    surgeryRoomNumber : '',
    date: '',
    staff: '',
    patient: ''
  };

  isDoctor: boolean = false;

  constructor(
    private service: AppointmentsService,
    private authService: AuthService,
    private requestService: OperationRequestsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin or doctor! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')
    || !this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin or doctor! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    if (this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.isDoctor = true;
    }

    await this.initializeRoute();
  }

  async initializeRoute() {
    this.route.queryParams.subscribe(async (params) => {
      if (params['page']) {
        this.currentPage = +params['page'];
      } else {
        this.currentPage = 1;
      }

      if (params['surgeryRoomNumber']) {
        this.filter.surgeryRoomNumber = params['surgeryRoomNumber'];
      }
      if (params['date']) {
        this.filter.date = params['date'];
      }
      if (params['staff']) {
        this.filter.staff = params['staff'];
      }
      if (params['patient']) {
        this.filter.patient = params['patient'];
      }
    });

    if (this.router.url.includes('create')) {
      this.showAppointmentsForm();
    } else if (this.router.url.includes('update')) {
      this.route.queryParams.subscribe((params) => {
        const number = params['number'];
        if (number) {
          this.selectedAppointment = this.appointments.find((ap) => ap.AppointmentNumber === number) || null;
          if (this.selectedAppointment) {
            this.showAppointmentsForm();
          }
        } else {
          this.router.navigate(['/appointments']);
          this.showAppointmentsList();
        }
      });
    } else {
      await this.showAppointmentsList();
    }
  }

  back() {
    this.router.navigate(['/' + this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase()]);
  }

  async loadAppointments() {
    try {
      const response = await this.service.getAll(this.filter, this.accessToken);
      this.appointments = response.body?.appointments || [];
      this.appointments.sort((a, b) => a.AppointmentNumber.localeCompare(b.AppointmentNumber));
      if (this.filter.surgeryRoomNumber) {
        this.appointments = this.appointments.filter((ap) =>
          ap.SurgeryRoomNumber.toLowerCase().includes(this.filter.surgeryRoomNumber.toLowerCase())
        );
      }
      if (this.filter.date) {
        this.appointments = this.appointments.filter((ap) =>
          ap.AppointmentDate.Start.toLowerCase().includes(this.filter.date.toLowerCase())
        );
      }
      if (this.filter.staff) {
        this.appointments = this.appointments.filter((ap) =>
          ap.AssignedStaff.includes(this.filter.staff)
        );
      }
      if (this.filter.patient) {
        const response = await this.requestService.get(this.accessToken, '', '', this.filter.patient, '', '','', '');
        const requests = response.body || [];
        const requestCodes = requests.map((req) => req.requestCode);
        this.appointments = this.appointments.filter((ap) =>
          requestCodes.includes(ap.RequestCode)
        );
      }
    } catch (error) {
      if ((error as any).status === 401 || (error as any).status === 403) {
        this.authService.updateMessage('You are not authorized to view Appointments! Please log in...');
        this.authService.updateIsError(true);
        setTimeout(() => this.router.navigate(['']), 3000);
      } else if ((error as any).status === 404) {
        this.authService.updateMessage('No route matches the provided URI!');
        this.authService.updateIsError(true);
        setTimeout(() => this.back(), 3000);
      }
      this.appointments = [];
    }
  }

  async showAppointmentsList() {
    this.showForm = false;
    this.appointments = [];
    this.selectedAppointment = null;
    this.filter.surgeryRoomNumber = '';
    this.filter.date = '';
    this.filter.staff = '';
    this.filter.patient = '';
    await this.loadAppointments().then(() => {
      this.router.navigate(['/appointments'], { queryParams: { page: 1 } });
      this.showList = true;
    });
  }

  async showAppointmentsForm() {
    this.showList = false;
    this.showForm = true;
    if (this.selectedAppointment) {
      this.router.navigate(['/appointments/update'], {
        queryParams: { number: this.selectedAppointment.AppointmentNumber }
      });
    } else {
      this.router.navigate(['/appointments/create']);
    }
  }

  async onSubmit() {
    setTimeout(async () => {
      await this.showAppointmentsList();
    }, 500);
  }

  async onEdit(appointment: Appointment) {
    this.selectedAppointment = appointment;
    await this.showAppointmentsForm();
  }

  async onCancel() {
    await this.showAppointmentsList();
  }
}