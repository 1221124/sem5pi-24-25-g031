import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Staff} from "../../../models/staff.model";
import {StaffsService} from "../../../services/staffs/staffs.service";
import {AuthService} from "../../../services/auth/auth.service";
import { FormsModule } from '@angular/forms';
import {Router} from "@angular/router";
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {PatientContactInfoComponent} from '../../patient/patient-contact-info/patient-contact-info.component';
import {SlotComponent} from '../../slot/slot.component';
import {OperationType} from '../../../models/operation-type.model';
import { SpecializationsService } from '../../../services/specializations/specializations.service';
import { Specialization } from '../../../models/specialization.model';

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
    NgForOf
  ],
})
export class ListStaffsComponent implements OnInit {

  @Input() staffs: Staff[] = [];
  @Input() totalItems: number = 0;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() itemsPerPage: number = 5;
  @Output() updateStaffEvent = new EventEmitter<Staff>();
  @Output() statusToggle = new EventEmitter<Staff>();



  showSlotAvailabilityModal = false;

  selectedStaff: Staff | null = null;
  constructor(private staffService: StaffsService, private specializationService: SpecializationsService, private authService: AuthService, private router: Router) { }

  filter = {
    pageNumber: 1,
    name: '',
    email: '',
    specialization: ''
  };
  specializations: Specialization[] = [];

  async ngOnInit() {
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    const accessToken = this.authService.getToken() as string;

    await this.specializationService.getSpecializations(accessToken).then((data) => {
      this.specializations = data.body.specializations;
    });
  }


  updateQueryParams() {
    const queryParams: any = {};
    const currentRoute = this.router.url;

    if (currentRoute.includes('create') || currentRoute.includes('update')) {
      return;
    }

    if (this.filter.name) {
      queryParams['name'] = this.filter.name;
    }
    if (this.filter.specialization) {
      queryParams['specialization'] = this.filter.specialization.split(' - ')[1];
    }

    if (this.currentPage) {
      queryParams['page'] = this.currentPage.toString();
    }

    this.router.navigate(['/admin/staffs'], { queryParams });
  }

  getNameFromSpecializationCode(code: string) {
    return this.specializations.find(s => s.SNOMEDCTCode === code)?.Name;
  }

  getPaginatedStaff(): Staff[] {
    const filteredStaffs = this.staffs.filter((staff) => {
      const matchesName = this.filter.name
        ? staff.FullName.FirstName.toLowerCase().includes(this.filter.name.toLowerCase()) ||
        staff.FullName.LastName.toLowerCase().includes(this.filter.name.toLowerCase())
        : true;

      const matchesEmail = this.filter.email
        ? staff.ContactInformation.Email.toLowerCase().includes(this.filter.email.toLowerCase())
        : true;

      const matchesSpecialization = this.filter.specialization
        ? staff.specialization === this.filter.specialization
        : true;

      return matchesName && matchesEmail && matchesSpecialization;
    });
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return filteredStaffs.slice(start, start + this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < Math.ceil(this.totalItems / this.itemsPerPage)) {
      this.currentPage++;
    }
    this.updateQueryParams();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.updateQueryParams();
  }

  applyFilter() {
    this.currentPage = 1;

    this.updateQueryParams();
  }

  async clearFilters() {
    this.filter = { pageNumber: 1, name: '', email: '', specialization: '' };
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
