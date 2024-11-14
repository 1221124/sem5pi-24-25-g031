import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { OperationTypesService } from '../../services/operation-types/operation-types.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  userForm: FormGroup;
  roles : string[] = [];
  emailPattern = /^[a-zA-Z0-9._%+-]+@isep\.ipp\.pt$/;

  constructor(private fb: FormBuilder, private authService: AuthService, private operationTypesService: OperationTypesService) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, this.emailValidator.bind(this)]],
      role: ['', Validators.required]
    });
  }

  async ngOnInit() {
    await this.operationTypesService.getStaffRoles().then((data) => {
      this.roles = data;
    });
  }

  emailValidator(control: any) {
    var role = this.userForm?.get('role')?.value;
    role = role?.toLowerCase();
    if (role) {
      const validEmailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@isep\.ipp\.pt$`);
      return validEmailRegex.test(control.value) ? null : { invalidEmail: true };
    }
    return null;
  }

  async onSubmit() {
    if (this.userForm.valid) {
      const { email, role } = this.userForm.value;
      const response = await this.authService.createUser(email, role);
      if (response?.status === 201) {
        this.authService.updateMessage('User created successfully');
        this.authService.updateIsError(false);
      } else {
        this.authService.updateMessage('Unexpected response during user creation: ' + response?.status);
        this.authService.updateIsError(true);
      }
    }
  }
}