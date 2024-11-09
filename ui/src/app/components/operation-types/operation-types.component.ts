import { Component } from '@angular/core';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';

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
  Cleaning: number
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
  imports: [],
  templateUrl: './operation-types.component.html',
  styleUrl: './operation-types.component.css'
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

  constructor(private operationTypesService: OperationTypesService) {}

  roles = Object.values(Role);
  specializations = Object.values(Specialization);

  addStaff(role: Role, specialization: Specialization, quantity: number) {
    this.operationType.RequiredStaff.push({
      Role: role,
      Specialization: specialization,
      Quantity: quantity
    });
  }

  submitOperationType() {
    return this.operationTypesService.post(this.operationType);
  }
}