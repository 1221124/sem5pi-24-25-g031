import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../models/appointment';
import { AppointmentsService } from '../../../services/appointments/appointments.service';
import { OperationRequestsService } from '../../../services/operation-requests/operation-requests.service';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { StaffsService } from '../../../services/staffs/staffs.service';
import { Staff } from '../../../models/staff.model';

@Component({
  selector: 'app-appointments-form',
  standalone: true,
  host: {
    class: 'appointments-form'
  },
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    CommonModule
  ],
  templateUrl: './appointments-form.component.html',
  styleUrls: ['./appointments-form.component.css']
})
export class AppointmentsFormComponent implements OnInit {
  @Input() appointment: Appointment | null = null;
  @Output() submit = new EventEmitter<Appointment>();
  @Output() cancel = new EventEmitter<void>();

  accessToken = '';

  availableStaff: Staff[] = [];

  constructor(
    private service: AppointmentsService,
    private operationRequestService: OperationRequestsService,
    private operationTypeService: OperationTypesService,
    private staffService: StaffsService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a doctor! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage('You are not authenticated or are not a doctor! Redirecting to login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.initializeAppointment();
  }

  initializeAppointment() {
    if (!this.appointment) {
      this.appointment = {
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
    }
  }

  async getAppointmentDuration() {
    try {
      if (this.appointment?.AppointmentDate.Start) {
        const requests = await this.operationRequestService.get(this.accessToken, this.appointment.RequestCode, '', '', '', '', '', '');
        if (requests.body.length > 0) {
          const operationRequest = requests.body[0];
          const response = await this.operationTypeService.getByCode(operationRequest.operationType, this.accessToken);
          if (response) {
            const operationType = response.body;
            if (operationType) {
              const duration = operationType.PhasesDuration.Preparation + operationType.PhasesDuration.Surgery + operationType.PhasesDuration.Cleaning;
              this.appointment.AppointmentDate.End = new Date(new Date(this.appointment.AppointmentDate.Start).getTime() + duration * 60000).toISOString();
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getStaffsAvailable() {
    try {
      if (this.appointment?.AppointmentDate.Start && this.appointment?.AppointmentDate.End) {
        // const staffs = await this.staffService.getStaffAvailable(this.accessToken, this.appointment.AppointmentDate.Start, this.appointment.AppointmentDate.End);
        // if (staffs.body) {
        //   staffs.body.staffs.forEach(element => {
        //     this.availableStaff.push(element);
        //   });
        // }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async submitForm() {
    if (this.appointment) {
      if (this.appointment.Id) {
        await this.service.update(this.appointment.Id, this.appointment, this.accessToken).then(() => {
          this.submit.emit(this.appointment!);
        });
      } else {
        await this.service.create(this.appointment, this.accessToken).then(() => {
          this.submit.emit(this.appointment!);
        });
      }
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}