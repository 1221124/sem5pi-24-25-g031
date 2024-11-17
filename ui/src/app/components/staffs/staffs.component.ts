import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffsService } from '../../services/staffs/staffs.service';
import { Router, RouterModule } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Staff } from '../../models/staff.model';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css',
  providers: [StaffsService]
})
export class StaffsComponent implements OnInit {

  constructor(private staffService: StaffsService, private authService: AuthService, private router: Router) { }

  staffs: Staff[] = [];
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  specialization: string = '';
  role: string = '';
  selectedStaff: any = null;

  searchName: string = '';
  searchEmail: string = '';
  searchSpecialization: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;  // Número de itens por página

  editingSlotAvailabilityIndex: number | null = null;
  isAddSlotAvailabilityFormVisible = false;  // Controls visibility of the Add Slot form
  newSlotStart: string = '';  // To bind the start datetime of the new slot
  newSlotEnd: string = '';    // To bind the end datetime of the new slot


  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  phoneNumberTouched = false;
  specializationTouched = false;
  isEditModalOpen = false;
  isCreateModalOpen = false;
  isDeleteModalOpen = false;
  isSlotAppointmentModal = false;
  isSlotAvailabilityModal = false;

  accessToken: string = '';


  filter = {
    pageNumber: 1,
    name: '',
    email: '',
    specialization: ''
  }
  totalItems: number = 0;
  totalPages: number = 1;

  message: string = '';
  success: boolean = true;

  specializations: string[] = [];
  names: string[] = [];
  emails: string[] = [];

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a staff! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
    await this.staffService.getSpecializations().then((data) => {
      this.specializations = data;
    });
    this.accessToken = this.authService.getToken();
    await this.fetchStaffs();
  }

  async fetchStaffs() {
    await this.staffService.getStaff(this.filter, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          if (response.body) {
            this.staffs = response.body.staffs;
            this.totalItems = response.body.totalItems || 0;
            this.totalPages = Math.ceil(this.totalItems / 2);
          } else {
            this.staffs = [];
            this.message = 'Response body is null: ' + response.body;
            this.success = false;
            this.totalItems = 0;
            this.totalPages = 1;
          }
        } else {
          this.staffs = [];
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      }).catch(error => {
        if (error.status === 404) {
          this.staffs = [];
          this.message = 'No staffs found!';
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        } else if (error.status === 401) {
          this.message = 'You are not authorized to view Staffs! Please log in...';
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        } else {
          this.staffs = [];
          this.message = 'There was an error fetching the Staffs: ' + error;
          this.success = false;
          this.totalItems = 0;
          this.totalPages = 1;
        }
      });
  }



  submitRequest() {
    // this.staffService.createStaff(creatingStaffDto).pipe(first()).subscribe(
    this.staffService.createStaff(this.firstName, this.lastName, this.phoneNumber, this.email, this.specialization, this.role);

    console.log("Staff profile submitted");

    // response => {
    //   this.message = 'Staff profile submitted successfully!';
    //   this.clearForm();
    // },
    // error => {
    //   this.message = 'Error submitting staff profile. Please try again.';
    // }
    //);

  }

  clearForm() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.phoneNumber = '';
    this.specialization = '';
    this.role = '';

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.emailTouched = false;
    this.phoneNumberTouched = false;
    this.specializationTouched = false;

  }

  openModal() {
    this.selectedStaff = null;
    this.isCreateModalOpen = true;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
  }

  closeModal() {
    this.isCreateModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
  }


  // Atualiza a página atual para a nova página selecionada
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Aplicar filtro
  async applyFilter() {
    this.filter = {
      pageNumber: 1,
      name: this.filter.name,
      email: this.filter.email,
      specialization: this.filter.specialization
    };
    await this.fetchStaffs();
  }

  async clearFilters() {
    this.filter = {
      pageNumber: 1,
      name: '',
      email: '',
      specialization: ''
    };
    await this.fetchStaffs();
  }


  // This method is triggered when the user clicks the "edit" button
  editStaff(patient: any) {
    this.selectedStaff = {
      firstName: patient.fullName.firstName,
      lastName: patient.fullName.lastName,
      email: patient.contactInformation.email,
      phoneNumber: patient.contactInformation.phoneNumber,
    };
    this.isEditModalOpen = true;
    this.isCreateModalOpen = false;

    //this.isCreateModalOpen = false;
  }

  deactivate(staff: any) {
    staff.Status = 'Inactive';
    console.log("Status ativado:", staff.Status); // Verificação de debug
  }


  confirmDelete(staff: any) {
    this.isDeleteModalOpen = true;
    this.selectedStaff = staff;
  }


  deleteConfirmed() {
    if (this.selectedStaff) {
      this.closeDeleteModal();
    }
  }


  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedStaff = null;
  }

  openSlotAppointmentModal(staff: any) {
    this.selectedStaff = {
      slotAppointment: staff.slotAppointment
    };
    this.isSlotAppointmentModal = true;
    this.isEditModalOpen = false;
    this.isCreateModalOpen = false;
  }

  closeSlotAppointmentModal() {
    this.isSlotAppointmentModal = false;
  }

  openSlotAvailabilityModal(staff: any) {
    this.selectedStaff = {
      slotAvailability: staff.slotAvailability
    };
    this.isSlotAvailabilityModal = true;
    this.isEditModalOpen = false;
    this.isCreateModalOpen = false;
  }

  closeSlotAvailabilityModal() {
    this.isSlotAvailabilityModal = false;
  }

  addConditionAvailability() {
    this.selectedStaff.slotAvailability.conditions.push({
      start: '',
      end: ''
    });
  }

  addSlotAvailability() {
    if (!this.selectedStaff.slotAvailability) {
      this.selectedStaff.slotAvailability = [];
    }

    // Only add a new slot if there is no ongoing slot creation
    const hasEmptySlot = this.selectedStaff.slotAvailability.some(
      (slot: { start: string; end: string; }) => slot.start === '' && slot.end === ''
    );

    if (!hasEmptySlot) {
      this.selectedStaff.slotAvailability.push({ start: '', end: '' });
      this.editingSlotAvailabilityIndex = this.selectedStaff.slotAvailability.length - 1;
    }
  }

  addNewSlotAvailability() {
    if (this.newSlotStart && this.newSlotEnd) {
      // Create a new slot object
      const newSlot = {
        start: this.newSlotStart,
        end: this.newSlotEnd
      };

      // Add the new slot to the patient's appointment history
      if (!this.selectedStaff.slotAvailability) {
        this.selectedStaff.slotAvailability = [];
      }
      this.selectedStaff.slotAvailability.push(newSlot);

      // Reset the form fields and hide the Add Slot form
      this.newSlotStart = '';
      this.newSlotEnd = '';
      this.isAddSlotAvailabilityFormVisible = false;
    } else {
      alert("Please select both start and end dates for the slot.");
    }
  }

  openAddSlotAvailabilityForm() {
    this.isAddSlotAvailabilityFormVisible = true;
  }

  deleteSlotAvailability() {

  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }
  saveStaff() { }

}