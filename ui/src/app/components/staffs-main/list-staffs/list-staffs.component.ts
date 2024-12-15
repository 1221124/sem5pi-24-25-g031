import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Staff} from "../../../models/staff.model";
import {StaffsService} from "../../../services/staffs/staffs.service";
import {AuthService} from "../../../services/auth/auth.service";
import { FormsModule } from '@angular/forms';
import {Router} from "@angular/router";
import { CommonModule } from '@angular/common';
import {PatientContactInfoComponent} from '../../patient/patient-contact-info/patient-contact-info.component';
import {SlotComponent} from '../../slot/slot.component';

@Component({
  selector: 'app-list-staffs',
  templateUrl: './list-staffs.component.html',
  styleUrl: './list-staffs.component.css',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PatientContactInfoComponent,
    SlotComponent,
  ],
})
export class ListStaffsComponent implements OnInit {

  @Input() staff!: Staff[];
  @Output() updateStaffEvent = new EventEmitter<Staff>();

  showSlotAvailabilityModal = false;
  isEditModalOpen = false;
  isCreateModalOpen = false;

  selectedStaff: Staff | null = null;
  constructor(private staffService: StaffsService, private authService: AuthService, private router: Router) { }

  staffs: Staff[] = [];
  filter = {
    pageNumber: 1,
    name: '',
    email: '',
    specialization: ''
  };
  totalItems: number = 0;
  totalPages: number = 1;
  specializations: string[] = [];
  isEditMode: boolean = false;



  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    const accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    await this.staffService.getSpecializations().then((data) => {
      this.specializations = data;
    });

    this.fetchStaffs();
  }

  async fetchStaffs() {
    await this.staffService.getStaff(this.filter, this.authService.getToken() as string)
        .then(response => {
          if (response.status === 200 && response.body) {
            this.staffs = response.body.staffs;
            this.totalItems = response.body.totalItems || 0;
            this.totalPages = Math.ceil(this.totalItems / 5);
          } else {
            this.staffs = [];
            this.totalItems = 0;
            this.totalPages = 1;
          }
        })
        .catch(error => {
          this.staffs = [];
          this.totalItems = 0;
          this.totalPages = 1;
          console.error('Error fetching staffs:', error);
        });
  }

  async applyFilter() {
    this.filter.pageNumber = 1;
    await this.fetchStaffs();
  }

  async clearFilters() {
    this.filter = { pageNumber: 1, name: '', email: '', specialization: '' };
    await this.fetchStaffs();
  }


  editStaff(staff: Staff) {
    console.log("Open modal editing...");
    this.staff = JSON.parse(JSON.stringify(staff));
    this.isEditModalOpen = true;
    this.isCreateModalOpen = false;
    this.isEditMode = true;
    console.log("Editing staff:", this.staff);
    this.updateStaffEvent.emit(staff);
  }

  inactivate(staffId: string) {
    console.log('Inactivating staff with ID:', staffId);
    // Implement inactivation logic
  }

  activate(staff: Staff) {
    console.log('Activating staff:', staff);
    // Implement activation logic
  }

  openSlotAvailabilityModal(staff: Staff) {
    this.selectedStaff = staff;
    this.showSlotAvailabilityModal = true;
  }

  openSlotAppointmentModal(staff: Staff) {
    console.log(staff);
    this.selectedStaff = staff;
    this.showSlotAvailabilityModal = true;
  }
  closeSlotAvailabilityModal(staff: Staff) {
    this.selectedStaff = null;
    this.showSlotAvailabilityModal = false;
  }
}
