import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Appointment } from '../../../models/appointment.model';
import { AppointmentsService } from '../../../services/appointments/appointments.service';
import { OperationRequestsService } from '../../../services/operation-requests/operation-requests.service';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { StaffsService } from '../../../services/staffs/staffs.service';
import { Staff } from '../../../models/staff.model';
import { SurgeryRoomsService } from '../../../services/surgery-rooms/surgery-rooms.service';
import { OperationRequest } from '../../../models/operation-request.model';
import { SurgeryRoom } from '../../../models/surgery-room.model';
import { Specialization } from '../../../models/specialization.model';
import { SpecializationsService } from '../../../services/specializations/specializations.service';

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
  @Input() request: OperationRequest = {
    id: '',
    staff: '',
    patient: '',
    operationType: '',
    deadlineDate: '',
    priority: '',
    status: '',
    requestCode: ''
  }
  @Output() submit = new EventEmitter<Appointment>();
  @Output() cancel = new EventEmitter<void>();

  accessToken = '';

  requiredStaff: {
    Role: string;
    Specialization: string;
    Quantity: number;
    IsRequiredInPreparation: boolean;
    IsRequiredInSurgery: boolean;
    IsRequiredInCleaning: boolean;
  }[] = [];
  availableStaff: Staff[] = [];
  surgeryRooms: SurgeryRoom[] = [];
  specializations: Specialization[] = [];
  staffLoading = false;
  staffMessage = '';

  minDate: string = '';
  maxDate: string = '';

  constructor(
    private service: AppointmentsService,
    private operationRequestService: OperationRequestsService,
    private operationTypeService: OperationTypesService,
    private staffService: StaffsService,
    private surgeryRoomService: SurgeryRoomsService,
    private specializationService: SpecializationsService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthWithRole(['Doctor'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
    
    await this.getSpecializations();
    await this.initializeData();
  }

  async getSpecializations() {
    try {
      const response = await this.specializationService.getSpecializations(this.accessToken);
      if (response.status == 200 && response.body) {
        this.specializations = response.body.specializations;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async initializeData() {
    console.log('Initializing data...');
    console.log('Request Code in initializing:', this.request.requestCode);
    if (this.router.url.includes('create') && !this.request.requestCode) {
      console.log('No request code found! Redirecting to appointments...');
      this.router.navigate(['/appointments'], {queryParams: {page : 1}});
      this.cancel.emit();
      return;
    }

    if (this.request.requestCode) {
      console.log('Request code found:', this.request.requestCode);
      this.appointment.RequestCode = this.request.requestCode;
      console.log('Appointment Request Code:', this.appointment.RequestCode);
      const number = this.request.requestCode.slice(3);
      this.appointment.AppointmentNumber = `ap${number}`;
    }
    
    if (this.appointment.RequestCode) {
      console.log('Request code:', this.appointment.RequestCode);
      await this.getRequiredStaff();
      console.log('Required staff:', this.requiredStaff);
    }

    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16);
    if (this.request.deadlineDate) {
      const deadline = new Date(this.request.deadlineDate);
      this.maxDate = deadline.toISOString().slice(0, 16);
    } else {
      this.maxDate = new Date(now.setFullYear(now.getFullYear() + 1)).toISOString().slice(0, 16);
    }
  }

  async getSurgeryRooms() {
    try {
      console.log('Start: ', this.appointment.AppointmentDate.Start);
      console.log('End: ', this.appointment.AppointmentDate.End);
      const response = await this.surgeryRoomService.getAvailable(this.appointment.AppointmentDate.Start, this.appointment.AppointmentDate.End, this.accessToken);
      if (response.body) {
        this.surgeryRooms = response.body.surgeryRooms;
      }
      if (this.router.url.includes('update')
        && this.appointment.SurgeryRoomNumber
        && !this.surgeryRooms.find(r => r.SurgeryRoomNumber === this.appointment.SurgeryRoomNumber)) {
        const room = {
          Id: '',
          SurgeryRoomNumber: this.appointment.SurgeryRoomNumber,
          RoomTypeCode: '',
          RoomCapacity: '',
          AssignedEquipment: '',
          CurrentStatus: '',
          MaintenanceSlots: []
        }
        this.surgeryRooms.push(room);
      }
      this.surgeryRooms.sort((a, b) => a.SurgeryRoomNumber.localeCompare(b.SurgeryRoomNumber));
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
              const startDate = new Date(this.appointment.AppointmentDate.Start);
              const endDate = new Date(startDate.getTime() + duration * 60000);
              this.appointment.AppointmentDate.End = endDate.toISOString().slice(0, 16);
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
      console.log('Getting required staff...');
      const opReqResponse = await this.operationRequestService.get(this.accessToken, this.appointment!.RequestCode, '', '', '', '', '', '');
      if (opReqResponse.body) {
        const request = opReqResponse.body[0];
        console.log('Request:', request);
        const opTypeResponse = await this.operationTypeService.getByCode(request.operationType, this.accessToken);
        if (opTypeResponse.body) {
          const operationType = opTypeResponse.body;
          console.log('Operation type:', operationType);
          if (operationType) {
            this.requiredStaff = operationType.RequiredStaff;
            console.log('Required staff:', this.requiredStaff);
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  async getStaffsAvailable() {
    console.log('Getting staffs available...');
    this.staffLoading = true;
    this.staffMessage = '';
    this.availableStaff = [];
    try {
      console.log('Start in staffs available:', this.appointment.AppointmentDate.Start);
      console.log('End in staffs available:', this.appointment.AppointmentDate.End);
      if (this.appointment?.AppointmentDate.Start && this.appointment?.AppointmentDate.End) {
        console.log('Entered getStaffsAvailable');
        const response = await this.staffService.getStaffAvailable(this.accessToken, this.appointment.AppointmentDate.Start, this.appointment.AppointmentDate.End);
        if (response.body) {
          this.availableStaff = response.body.staffs;
          console.log('Available staff:', this.availableStaff);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        if (this.availableStaff.length < this.requiredStaff.length) {
          console.log('Not enough! Available:', this.availableStaff.length, '. Required:', this.requiredStaff.length);
          this.staffMessage = 'Not enough staff available for this appointment! Please select another date...';
        }
        this.staffLoading = false;
      }, 2000);
    }
  }

  getSpecializationName(code: string): string {
    const specialization = this.specializations.find(s => s.SNOMEDCTCode === code);
    return specialization ? specialization.Name : 'Unknown';
  }

  async onAppointmentDateChange() {
    if (this.appointment?.AppointmentDate.Start) {
      await this.getAppointmentDuration();
      await this.getSurgeryRooms();
      await this.getStaffsAvailable();
    }
  }

  getAvailableStaffForRole(staff: any): any[] {
    return this.availableStaff.filter(a => a.staffRole === staff.Role && a.specialization === staff.Specialization);
  }

  onStaffSelectionChange(staff: Staff, event: any) {
    if (event.target.checked) {
      this.addStaff(staff);
    } else {
      this.removeStaff(staff);
    }
  }

  async addStaff(staff: Staff) {
    if (this.appointment.RequestCode && !this.appointment.AssignedStaff.includes(staff.licenseNumber)) {
      console.log('Adding staff:', staff.licenseNumber);
      this.appointment.AssignedStaff.push(staff.licenseNumber);
    }
  }
  
  async removeStaff(staff: Staff) {
    if (this.appointment.RequestCode) {
      console.log('Removing staff:', staff.licenseNumber);
      this.appointment.AssignedStaff = this.appointment.AssignedStaff.filter(s => s !== staff.licenseNumber);
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

  isFormValid(): boolean {
    return !!this.appointment.RequestCode &&
           !!this.appointment.SurgeryRoomNumber &&
           !!this.appointment.AppointmentDate.Start &&
           this.requiredStaff.every(staff => {
             const assignedCount = this.appointment.AssignedStaff.filter(
               licenseNumber => {
                 const assignedStaff = this.availableStaff.find(s => s.licenseNumber === licenseNumber);
                 return assignedStaff?.staffRole === staff.Role && assignedStaff?.specialization === staff.Specialization;
               }
             ).length;
  
             return assignedCount == staff.Quantity;
           });
  }

  cancelForm() {
    this.cancel.emit();
  }
}