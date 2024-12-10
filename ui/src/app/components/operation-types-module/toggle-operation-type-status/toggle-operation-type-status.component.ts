import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OperationType } from '../../../models/operation-type.model';
import { OperationTypesService } from '../../../services/operation-types/operation-types.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-toggle-operation-type-status',
  standalone: true,
  templateUrl: './toggle-operation-type-status.component.html',
  styleUrls: ['./toggle-operation-type-status.component.css']
})
export class ToggleOperationTypeStatusComponent implements OnInit {
  @Input() operationType!: OperationType;
  @Output() statusToggled = new EventEmitter<void>(); 
  @Output() cancel = new EventEmitter<void>(); 

  accessToken = '';

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
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => this.router.navigate(['']), 3000);
      return;
    }
  }

  async toggleStatus() {
    try {
      if (this.operationType.Status.trim().toLowerCase() === 'active') {
        await this.service.deleteOperationType(this.operationType.Id, this.accessToken).then(() => {
          this.statusToggled.emit();
        });
      } else {
        await this.service.updateOperationType(
          this.operationType.Id,
          { ...this.operationType, Status: 'Active' },
          this.accessToken
        ).then(() => {
          this.statusToggled.emit();
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }

  onCancel() {
    this.cancel.emit();
  }
}