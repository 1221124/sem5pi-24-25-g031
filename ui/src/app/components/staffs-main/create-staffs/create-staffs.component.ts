import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Staff} from '../../../models/staff.model';
import {OperationRequest} from '../../../models/operation-request.model';
import {FormsModule} from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';
import {StaffsService} from '../../../services/staffs/staffs.service';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-staffs',
  templateUrl: './create-staffs.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgFor,
    NgIf
  ],
  styleUrl: './create-staffs.component.css'
})
export class CreateStaffsComponent implements OnInit {
  @Input() staff!: Staff;

  @Output() createRequestEvent = new EventEmitter<Staff>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  specializations: string[] = [];
  roles: string[] = [];
  names: string[] = [];
  emails: string[] = [];

  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  phoneNumberTouched = false;
  specializationTouched = false;
  roleTouched = false;

  accessToken: string = '';

  constructor(private staffService: StaffsService, private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {

    if (!this.staff) {
      this.staff = {
        Id: '',
        FullName: {FirstName: '', LastName: ''},
        licenseNumber: '',
        specialization: '',
        staffRole: '',
        ContactInformation: {Email: '', PhoneNumber: ''},
        status: '',
        SlotAppointment: [{Start: '', End: ''}],
        SlotAvailability: [{Start: '', End: ''}],
      };
    }

    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.staffService.getStaffRoles().then((data) => {
      this.roles = data;
    });

    this.staffService.getSpecializations().then((data) => {
      this.specializations = data;
    });

  }


  closeCreateModal() {
    this.closeModalEvent.emit();
  }

  submitRequest() {
     this.createRequestEvent.emit(this.staff);
  }

  clearForm() {
    this.staff = {
      Id: '',
      FullName: { FirstName: '', LastName: '' },
      licenseNumber: '',
      specialization: '',
      staffRole: '',
      ContactInformation: { Email: '', PhoneNumber: '' },
      status: '',
      SlotAppointment: [{ Start: '', End: '' }],
      SlotAvailability: [{ Start: '', End: '' }],
    };

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.emailTouched = false;
    this.phoneNumberTouched = false;
    this.specializationTouched = false;
    this.roleTouched = false;
  }


}
