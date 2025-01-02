import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Staff} from '../../../models/staff.model';
import {OperationRequest} from '../../../models/operation-request.model';
import {FormsModule} from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';
import {StaffsService} from '../../../services/staffs/staffs.service';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';
import { Specialization } from '../../../models/specialization.model';
import { SpecializationsService } from '../../../services/specializations/specializations.service';
import { EnumsService } from '../../../services/enums/enums.service';

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

  @Output() createStaffEvent = new EventEmitter<Staff>();
  @Output() updateStaffEvent = new EventEmitter<Staff>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  specializations: Specialization[] = [];
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

  constructor(private staffService: StaffsService, private enumService: EnumsService, private specializationService: SpecializationsService, private authService: AuthService, private router: Router) {
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
        SlotAvailability: [{Start: '', End: ''}],
      };
    }

    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    this.enumService.getStaffRoles(this.accessToken).then((data) => {
      this.roles = data;
    });

    this.specializationService.getSpecializations(this.accessToken).then((data) => {
      this.specializations = data.body.specializations;
    });

  }


  closeCreateModal() {
    this.closeModalEvent.emit();
  }

  submitRequest() {
     this.createStaffEvent.emit(this.staff);
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
