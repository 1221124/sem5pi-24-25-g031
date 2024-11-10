import { Component } from '@angular/core';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

enum Role {
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  TECHNICIAN = 'Technician'
}

enum Specialization {
  ANAESTHESIOLOGY = 'Anaesthesiology',
  CARDIOLOGY = 'Cardiology',
  CIRCULATING = 'Circulating',
  INSTRUMENTAL = 'Instrumental',
  MEDICAL_ACTION = 'Medical Action',
  ORTHOPAEDICS = 'Orthopaedics',
  X_RAY = 'X-Ray'
}

interface RequiredStaff {
  Role: Role;
  Specialization: Specialization;
  Quantity: number;
}

interface PhaseDurations {
  Preparation: number;
  Surgery: number;
  Cleaning: number;
}

export interface OperationType {
  Name: string;
  Specialization: Specialization;
  RequiredStaff: RequiredStaff[];
  PhasesDuration: PhaseDurations;
}

@Component({
  selector: 'app-operation-types',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './operation-types.component.html',
  styleUrls: ['./operation-types.component.css']
})
export class OperationTypesComponent {
  operationType: OperationType = {
    Name: '',
    Specialization: Specialization.ANAESTHESIOLOGY,
    RequiredStaff: [],
    PhasesDuration: {
      Preparation: 0,
      Surgery: 0,
      Cleaning: 0
    }
  };

  newStaff: RequiredStaff = {
    Role: Role.DOCTOR,
    Specialization: Specialization.ANAESTHESIOLOGY,
    Quantity: 1
  };

  constructor(private operationTypesService: OperationTypesService) {}

  roles = Object.values(Role);
  specializations = Object.values(Specialization);

  addStaff() {
    if (this.newStaff.Quantity > 0) {
      this.operationType.RequiredStaff.push({ ...this.newStaff });
      this.newStaff = {
        Role: Role.DOCTOR,
        Specialization: Specialization.ANAESTHESIOLOGY,
        Quantity: 1
      };
    }
  }

  submitOperationType() {
    return this.operationTypesService.post(this.operationType);
  }
}