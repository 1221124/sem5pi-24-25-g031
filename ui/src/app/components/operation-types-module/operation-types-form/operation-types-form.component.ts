import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OperationType } from '../../../models/operation-type.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';

@Component({
  selector: 'app-operation-types-form',
  standalone: true,
  host: {
    class: 'operation-types-form'
  },
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    CommonModule
  ],
  templateUrl: './operation-types-form.component.html',
  styleUrls: ['./operation-types-form.component.css']
})
export class OperationTypesFormComponent implements OnInit {
  @Input() operationType: OperationType | null = null;
  @Input() roles: string[] = [];
  @Input() specializations: string[] = [];
  @Input() statuses: string[] = [];
  @Output() submit = new EventEmitter<OperationType>();
  @Output() cancel = new EventEmitter<void>();

  accessToken = '';

  newRequiredStaff = {
    Role: '',
    Specialization: '',
    Quantity: 1,
    IsRequiredInPreparation: false,
    IsRequiredInSurgery: false,
    IsRequiredInCleaning: false
  };

  constructor(private service: OperationTypesService, private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }

    this.initializeOperationType();
  }

  initializeOperationType() {
    if (!this.operationType) {
      this.operationType = {
        Id: '',
        OperationTypeCode: '',
        Name: '',
        Specialization: '',
        RequiredStaff: [],
        PhasesDuration: { 
          Preparation: 0, 
          Surgery: 0, 
          Cleaning: 0 
        },
        Status: 'Active',
        Version: 1,
      };
    } else {
      console.log('OperationType version: ' + this.operationType.Version);
    }
    this.ensureNewStaffBlock();
  }

  ensureNewStaffBlock() {
    if (!this.isStaffValid(this.newRequiredStaff)) return;
    const lastStaff = this.operationType!.RequiredStaff[this.operationType!.RequiredStaff.length - 1];
    if (!lastStaff || this.isStaffValid(lastStaff)) {
      this.operationType!.RequiredStaff.push({ ...this.newRequiredStaff });
    }
  }

  isStaffValid(staff: any): boolean {
    return staff !== undefined &&
    staff.Role !== '' &&
    staff.Specialization !== '' &&
    staff.Quantity > 0 &&
    (staff.IsRequiredInPreparation || staff.IsRequiredInSurgery || staff.IsRequiredInCleaning);
  }

  addRequiredStaff() {
    this.ensureNewStaffBlock();
    this.newRequiredStaff = {
      Role: '',
      Specialization: '',
      Quantity: 1,
      IsRequiredInPreparation: false,
      IsRequiredInSurgery: false,
      IsRequiredInCleaning: false
    }
  }

  removeRequiredStaff(index: number) {
    this.operationType!.RequiredStaff.splice(index, 1);
  }

  async submitForm() {
    if (this.operationType) {
      if (this.operationType.Id) {
        console.log('Updating operation type with version: ' + this.operationType.Version);
        await this.service.updateOperationType(this.operationType.Id, this.operationType, this.accessToken).then(() => {
          this.submit.emit(this.operationType!);
        });
      } else {
        await this.service.post(this.operationType, this.accessToken).then(() => {
          this.submit.emit(this.operationType!);
        });
      }
    }
  }

  cancelForm() {
    this.cancel.emit();
  }
}