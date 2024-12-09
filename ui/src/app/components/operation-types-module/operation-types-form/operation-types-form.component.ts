import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OperationType } from '../../../models/operation-type.model';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  @Input() specializations: string[] = [];
  @Input() statuses: string[] = [];
  @Output() submit = new EventEmitter<OperationType>();
  @Output() cancel = new EventEmitter<void>();

  accessToken = '';

  constructor(private authService: AuthService, private router: Router) {}

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
        RequiredStaff: [{
          Role: '',
          Specialization: '',
          Quantity: 1,
          IsRequiredInPreparation: false,
          IsRequiredInSurgery: false,
          IsRequiredInCleaning: false
        }],
        PhasesDuration: { 
          Preparation: 0, 
          Surgery: 0, 
          Cleaning: 0 
        },
        Status: 'Active',
        Version: 1,
      };
    }
  }

  addRequiredStaff() {
    this.operationType!.RequiredStaff.push({
      Role: '',
      Specialization: '',
      Quantity: 1,
      IsRequiredInPreparation: false,
      IsRequiredInSurgery: false,
      IsRequiredInCleaning: false,
    });
  }

  removeRequiredStaff(index: number) {
    this.operationType!.RequiredStaff.splice(index, 1);
  }

  submitForm() {
    if (this.operationType) {
      this.submit.emit(this.operationType);
    }
  }
}