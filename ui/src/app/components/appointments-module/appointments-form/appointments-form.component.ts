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
import { SurgeryRoomsService } from '../../../services/surgery-rooms/surgery-rooms.service';
import { OperationRequest } from '../../../models/operation-request.model';
import { SurgeryRoom } from '../../../models/surgery-room';

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
  @Input() appointment: Appointment = {
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
  @Output() submit = new EventEmitter<Appointment>();
  @Output() cancel = new EventEmitter<void>();

  accessToken = '';

  requiredStaff: {
    role: string;
    specialization: string;
    quantity: number;
  }[] = [];
  requests: OperationRequest[] = [];
  availableStaff: Staff[] = [];
  surgeryRooms: SurgeryRoom[] = [];

  constructor(
    private service: AppointmentsService,
    private operationRequestService: OperationRequestsService,
    private operationTypeService: OperationTypesService,
    private staffService: StaffsService,
    private surgeryRoomService: SurgeryRoomsService,
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

    await this.getOperationRequests();
    await this.getSurgeryRooms();
  }

  async getOperationRequests() {
    try {
      const pendingRequests = await this.operationRequestService.get(this.accessToken, '', '', '', '', '', '', 'pending');
      const rejectedRequests = await this.operationRequestService.get(this.accessToken, '', '', '', '', '', '', 'rejected');
      if (pendingRequests.body && rejectedRequests.body) {
        this.requests = pendingRequests.body;
        this.requests.push(...rejectedRequests.body);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getSurgeryRooms() {
    try {
      const response = await this.surgeryRoomService.get(this.accessToken);
      if (response.body) {
        this.surgeryRooms = response.body.surgeryRooms;
      }
    } catch (error) {
      console.error(error);
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
              //TODO: Review this
              //add duration in minutes to the start date and set it as the end date
              this.appointment.AppointmentDate.End = new Date(this.appointment.AppointmentDate.Start).setMinutes(new Date(this.appointment.AppointmentDate.Start).getMinutes() + duration).toString();
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getRequiredStaff() {
    this.requiredStaff = [];
    try {
      const opReqResponse = await this.operationRequestService.get(this.accessToken, this.appointment!.RequestCode, '', '', '', '', '', '');
      if (opReqResponse.body) {
        const request = opReqResponse.body[0];
        const opTypeResponse = await this.operationTypeService.getByCode(request.operationType, this.accessToken);
        if (opTypeResponse.body) {
          const operationType = opTypeResponse.body;
          if (operationType) {
            operationType.RequiredStaff.forEach(async (staff: { role: string; specialization: string; number: number; }) => {
              this.requiredStaff.push({ role: staff.role, specialization: staff.specialization, quantity: staff.number });
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getStaffsAvailable() {
    this.availableStaff = [];
    try {
      if (this.appointment?.AppointmentDate.Start && this.appointment?.AppointmentDate.End) {
        // const opRequestResponse = await this.operationRequestService.get(this.accessToken, this.appointment.RequestCode, '', '', '', '', '', '');
        // if (opRequestResponse.body) {
        //   const request = opRequestResponse.body[0];
        //   const opTypeResponse = await this.operationTypeService.getByCode(request.operationType, this.accessToken);
        //   if (opTypeResponse.body) {
        //     const operationType = opTypeResponse.body;
        //     if (operationType) {
        //       operationType.RequiredStaff.forEach(async (staff: { role: string; specialization: string; number: number; }) => {
        //         const response = await this.staffService.getStaffAvailable(this.accessToken, staff, this.appointment!.AppointmentDate.Start, this.appointment!.AppointmentDate.End);
        //         if (response.body) {
        //           response.body.staffs.forEach(element => {
        //             this.availableStaff.push(element);
        //           });
        //         }
        //       });
        //     }
        //   }
        const response = await this.staffService.getStaffAvailable(this.accessToken, this.appointment.AppointmentDate.Start, this.appointment.AppointmentDate.End);
        if (response.body) {
          this.availableStaff = response.body.staffs;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  getAvailableStaffForRole(staff: any): any[] {
    return this.availableStaff.filter(a => a.staffRole === staff.role && a.specialization === staff.specialization);
  }

  async addStaff(staff: Staff) {
    if (this.appointment) {
      this.appointment.AssignedStaff.push(staff.licenseNumber);
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

  async onRequestCodeChange() {
    await this.getRequiredStaff();
    await this.getStaffsAvailable();
  }
}