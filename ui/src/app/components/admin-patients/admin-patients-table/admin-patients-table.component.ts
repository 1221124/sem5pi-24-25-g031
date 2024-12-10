import {Component, Input} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {PatientsService} from '../../../services/admin-patients/admin-patients.service';
import {Patient} from '../../../models/patient.model';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {HttpErrorResponse} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {log} from 'node:util';

@Component({
  selector: 'app-admin-patients-table',
  templateUrl: './admin-patients-table.component.html',
  styleUrl: './admin-patients-table.component.css',
  imports: [
    NgForOf,
    FormsModule,
    DatePipe,
    NgIf
  ],
  standalone: true
})
export class AdminPatientsTableComponent {
  @Input() patients!: Patient[];
  @Input() accessToken!: string;

  selectedPatient : any = {};

  isAppointmentHistoryModalOpen = false;

  constructor(
    private patientService: PatientsService,
    private router: Router,
    private authService: AuthService
  ) {}

  filter = {
    pageNumber: 1,
    fullName: '',
    email: '',
    phoneNumber: '',
    medicalRecordNumber: '',
    dateOfBirth: '',
    gender: ''
  }

  applyFilter() {
    this.refreshPatients();
  }

  clearFilters(): void {
    this.filter = {
      pageNumber: 0,
      fullName: '',
      email: '',
      phoneNumber: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: ''
    };
    this.refreshPatients();
  }

  async refreshPatients() {
    try {
      const response = await firstValueFrom(this.patientService.getFilterPatients(this.filter, this.accessToken));
      this.patients = response || [];
    } catch (error) {
      console.error('Error refreshing patients:', error);
    }
  }

  openAppointmentHistoryModal(patient: any) {
    if (Array.isArray(patient) && patient.length > 0) {
      if (patient[0].AppointmentHistory) {
        this.selectedPatient = {
          appointmentHistory: patient[0].AppointmentHistory
        };
        console.log("selectedPatient 1 if", this.selectedPatient);
        this.isAppointmentHistoryModalOpen = true;
      } else {
        console.log("Histórico de consultas não encontrado para este paciente.");
      }
    } else if (patient && patient.AppointmentHistory) {
      this.selectedPatient = {
        appointmentHistory: patient.AppointmentHistory
      };
      console.log("selectedPatient 2 if", this.selectedPatient);
      this.isAppointmentHistoryModalOpen = true;
    } else {
      console.log("Não foi possível acessar o histórico de consultas.");
    }
  }


  closeAppointmentHistoryModal() {
    this.isAppointmentHistoryModalOpen = false;
  }


}
