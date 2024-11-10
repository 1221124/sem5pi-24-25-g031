import { Component, OnInit } from '@angular/core';
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
export class OperationTypesComponent implements OnInit {
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

  roles: string[] = [];
  specializations: string[] = [];
  message: string = '';
  success: boolean = true;

  constructor(private operationTypesService: OperationTypesService) {}

  ngOnInit() {
    this.operationTypesService.getStaffRoles().then((data) => {
      this.roles = data;
    });
    this.operationTypesService.getSpecializations().then((data) => {
      this.specializations = data;
    });
  }

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
    this.operationTypesService.post(this.operationType)
      .then(response => {
        if (response.status === 201) {
          this.message = 'Operation Type successfully created!';
          this.success = true;
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        this.message = 'There was an error creating the Operation Type: ' + error;
        this.success = false;
      });
  }
}