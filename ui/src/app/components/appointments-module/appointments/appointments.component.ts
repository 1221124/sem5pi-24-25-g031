import { CommonModule, NgIf, NgForOf, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { AppointmentsService } from '../../../services/appointments/appointments.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Appointment } from '../../../models/appointment.model';
import { OperationRequestsService } from '../../../services/operation-requests/operation-requests.service';
import { AppointmentsListComponent } from '../appointments-list/appointments-list.component';
import { AppointmentsFormComponent } from '../appointments-form/appointments-form.component';
import { OperationRequest } from '../../../models/operation-request.model';
import { OperationRequestsTableComponent } from '../../operation-requests-main/operation-requests-table/operation-requests-table.component';

@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgForOf, RouterOutlet, AppointmentsListComponent, AppointmentsFormComponent, OperationRequestsTableComponent],
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.css'
})
export class AppointmentsComponent implements OnInit {
  accessToken: string = '';
  showList : boolean = false;
  showForm : boolean = false;
  showOperationRequests: boolean = false;

  selectedAppointment: Appointment = {
    Id: '',
    RequestCode: '',
    SurgeryRoomNumber: '',
    AppointmentNumber: '',
    AppointmentDate: {
      Start: '',
      End: ''
    },
    AssignedStaff: []
  }
  selectedRequest: OperationRequest = {
    id: '',
    staff: '',
    patient: '',
    operationType: '',
    deadlineDate: '',
    priority: '',
    status: '',
    requestCode: ''
  }
  appointments: Appointment[] = [];
  currentPage: number = 1;
  totalItems: number = 0;
  totalPages: number = 1;
  itemsPerPage = 1;
  filter = {
    surgeryRoomNumber : '',
    date: '',
    staff: '',
    patient: ''
  };

  isDoctor: boolean = false;
  requests: OperationRequest[] = [];

  constructor(
    private service: AppointmentsService,
    private authService: AuthService,
    private requestService: OperationRequestsService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthWithRole(['Admin', 'Doctor'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
    
    this.isDoctor = this.authService.isA('Doctor');

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

    if (this.isDoctor) {
      if (this.router.url.includes('create')) {
        this.showAppointmentsForm();
      } else if (this.router.url.includes('update')) {
        this.route.queryParams.subscribe((params) => {
          const number = params['number'];
          if (number) {
            const appointment = this.appointments.find((ap) => ap.AppointmentNumber === number);
            if (appointment?.Id) {
              this.selectedAppointment = appointment;
              this.showAppointmentsForm();
            }
          } else {
            this.router.navigate(['/doctor/appointments']);
            this.showAppointmentsList();
          }
        });
      } else {
        this.router.navigate(['/doctor/appointments']);
        await this.showAppointmentsList();
      }
    } else {
      this.router.navigate(['/admin/appointments']);
      await this.showAppointmentsList();
    }
  }

  back() {
    if (this.isDoctor) {
      this.router.navigate(['/doctor']);
    } else {
      this.router.navigate(['/admin']);
    }
  }

  async loadAppointments() {
    try {
      const response = await this.service.getAll(this.accessToken);
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
      this.appointments.sort((a, b) => a.AppointmentNumber.localeCompare(b.AppointmentNumber));
      this.appointments.forEach((ap) => { ap.AssignedStaff.sort(); });
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
    } finally {
      this.totalItems = this.appointments.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.currentPage = 1;
    }
  }

  async showAppointmentsList() {
    this.showForm = false;
    this.appointments = [];
    this.selectedAppointment = {
      Id: '',
      RequestCode: '',
      SurgeryRoomNumber: '',
      AppointmentNumber: '',
      AppointmentDate: {
        Start: '',
        End: ''
      },
      AssignedStaff: []
    };
    this.selectedRequest = {
      id: '',
      staff: '',
      patient: '',
      operationType: '',
      deadlineDate: '',
      priority: '',
      status: '',
      requestCode: ''
    };
    this.filter.surgeryRoomNumber = '';
    this.filter.date = '';
    this.filter.staff = '';
    this.filter.patient = '';
    await this.loadAppointments().then(() => {
      if (this.isDoctor) this.router.navigate(['/doctor/appointments'], { queryParams: { page: 1 } });
      else this.router.navigate(['/admin/appointments'], { queryParams: { page: 1 } });
      this.showList = true;
    });
  }

  async showAppointmentsForm() {
    this.showList = false;
    this.showForm = true;
    if (this.selectedAppointment.Id) {
      this.router.navigate(['/doctor/appointments/update'], {
        queryParams: { number: this.selectedAppointment.AppointmentNumber }
      });
    } else {
      this.router.navigate(['/doctor/appointments/create']);
    }
  }

  async showRequests() {
    this.showList = false;
    await this.getOperationRequests();
    this.location.go('/doctor/operation-requests');
    this.showOperationRequests = true;
  }

  async getOperationRequests() {
    try {
      this.requests = [];
      const response = await this.requestService.getAll(this.accessToken);
      this.requests = response.body || [];
      this.requests = this.requests.filter((req) => (req.status.toLowerCase() == 'pending' || req.status.toLowerCase() == 'rejected'));
    } catch (error) {
      console.error('Error fetching operation requests:', error);
    }
  }

  async onFilterChange(filters: { surgeryRoomNumber: string; date: string; staff: string; patient: string }) {
    this.filter.surgeryRoomNumber = filters.surgeryRoomNumber;
    this.filter.date = filters.date;
    this.filter.staff = filters.staff;
    this.filter.patient = filters.patient;
    await this.loadAppointments();
  }

  async onMakeAppointment(request: OperationRequest) {
    this.showOperationRequests = false;
    this.selectedRequest = request;
    this.selectedAppointment = {
      Id: '',
      RequestCode: request.requestCode,
      SurgeryRoomNumber: '',
      AppointmentNumber: '',
      AppointmentDate: {
        Start: '',
        End: ''
      },
      AssignedStaff: []
    };
    await this.showAppointmentsForm();
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

  async onDelete(appointment: Appointment) {
    try {
      await this.service.delete(appointment.Id, this.accessToken);
      await this.showAppointmentsList();
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  }

  async onCancel() {
    this.router.navigate(['/doctor/appointments']);
    await this.showAppointmentsList();
  }
}