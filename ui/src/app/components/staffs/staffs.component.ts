import { Component, NgModule, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffsService } from '../../services/staffs/staffs.service';
import { Router, RouterModule } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { Staff } from '../../models/staff.model';
import { response } from 'express';
import { Console } from 'console';
import {OperationType} from '../../models/operation-type.model';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css'
})
export class StaffsComponent implements OnInit {

  constructor(private staffService: StaffsService, private authService: AuthService, private router: Router) { }

  staff: Staff = {
    Id: '',
    FullName: {
      FirstName: '',
      LastName: ''
    },
    licenseNumber: '',
    specialization: '',
    staffRole: '',
    ContactInformation: {
      Email: '',
      PhoneNumber: ''
    },
    status: '',
    SlotAppointment: [
      {
        Start: '',
        End: ''
      }
    ],
    SlotAvailability: [
      {
        Start: '',
        End: ''
      }
    ]
  };

  staffs: Staff[] = [];
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
  staffToDelete: Staff | null = null;


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
  roles: string[] = [];
  names: string[] = [];
  emails: string[] = [];

  showCreateForm: boolean = false;
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

    await this.staffService.getStaffRoles().then((data) => {
      this.roles = data;
    });

    await this.staffService.getSpecializations().then((data) => {
      this.specializations = data;
    });

    this.accessToken = this.authService.getToken() as string;
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



  async submitRequest() {
    console.log("Staff:", this.staffs);
    if (this.isEditMode) {
      console.log("Updating staff:", this.staff.Id);
      await this.update(this.staff.Id);
    } else {
      this.staffService.post(this.staff, this.accessToken)
        .then(response => {
          if (response.status === 201) {
            this.message = 'Staff successfully created!';
            this.success = true;
            this.closeModal();
            this.fetchStaffs();
            setTimeout(() => {
              this.success = false;
            }, 3000);
          } else {
            this.message = 'Unexpected response status: ' + response.status;
            this.success = false;
          }
        })
        .catch(error => {
          if (error.status === 401) {
            this.message = 'You are not authorized to create Staff! Please log in...';
            this.success = false;
            setTimeout(() => {
              this.router.navigate(['']);
            }, 3000);
            return;
          } else if (error.status == 400) {
            this.message = 'Bad Request... ' + error;
          }
          this.message = 'There was an error creating the Staff: ' + error;
          this.success = false;
        });
      await this.fetchStaffs();
    }
  }
  // this.staffService.createStaff(creatingStaffDto).pipe(first()).subscribe(
  //this.staffService.createStaff(this.firstName, this.lastName, this.phoneNumber, this.email, this.specialization, this.role);

  //console.log("Staff profile submitted");

  // response => {
  //   this.message = 'Staff profile submitted successfully!';
  //   this.clearForm();
  // },
  // error => {
  //   this.message = 'Error submitting staff profile. Please try again.';
  // }
  //);

  async update(id: string) {
    await this.staffService.update(id, this.staff, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Staff successfully updated!';
          this.success = true;
          setTimeout(() => {
            this.clearForm();
            this.showCreateForm = false;
          }, 3000);
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.message = 'You are not authorized to update Staffs! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }
        this.message = 'There was an error updating the Staff: ' + error;
        this.success = false;
      });
    await this.fetchStaffs();
  }


  clearForm() {
    this.staff = {
      Id: '',
      FullName: {
        FirstName: '',
        LastName: ''
      },
      licenseNumber: '',
      specialization: '',
      staffRole: '',
      ContactInformation: {
        Email: '',
        PhoneNumber: ''
      },
      status: '',
      SlotAppointment: [
        {
          Start: '',
          End: ''
        }
      ],
      SlotAvailability: [
        {
          Start: '',
          End: ''
        }
      ]
    };
    this.isEditMode = false;
    this.message = '';

  }

  openModal() {
    this.selectedStaff = null;
    this.isCreateModalOpen = true;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.isEditMode = false;
  }

  closeModal() {
    this.isCreateModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
  }


  // Atualiza a página atual para a nova página selecionada
  async changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      await this.fetchStaffs();
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
  editStaff(staff: Staff) {
    this.staff = JSON.parse(JSON.stringify(staff));
    this.isEditModalOpen = true;
    this.isCreateModalOpen = false;
    this.isEditMode = true; // Configura para o modo de edição
    console.log("Editing staff:", this.staff); // Log para debug

    //this.isCreateModalOpen = false;
  }

  startEditStaff(staff: Staff, isActivate: boolean): void {
    this.staff = { ...staff };
    if (isActivate) {
      this.showCreateForm = false;
      this.staff.status = 'Active';
    } else {
      this.showCreateForm = true;
    }
    this.isEditMode = true;
  }

  async inactivate(staff: string) {
    await this.staffService.deleteStaff(staff, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Staff successfully inactivated!';
          this.success = true;
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.message = 'You are not authorized to delete Staff! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }
        this.message = 'There was an error deleting the Staff: ' + error;
        this.success = false;
      });
    await this.fetchStaffs();
  }

  async activate(staff: Staff) {
    this.startEditStaff(staff, true);
    await this.update(staff.Id);
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
    this.selectedStaff = staff;
    this.isSlotAppointmentModal = true;
    this.isEditModalOpen = false;
    this.isCreateModalOpen = false;
  }

  closeSlotAppointmentModal() {
    this.isSlotAppointmentModal = false;
  }

  openSlotAvailabilityModal(staff: any) {
    this.selectedStaff = staff;
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

  deleteSlotAvailability(staff: Staff, slotIndex: number) {
    if (!staff) {
      console.warn('Staff object is null or undefined.');
      return;
    }

    if (!Array.isArray(staff.SlotAvailability)) {
      console.warn('SlotAvailability is not a valid array.');
      return;
    }

    if (slotIndex < 0 || slotIndex >= staff.SlotAvailability.length) {
      console.warn('Invalid slot index.');
      return;
    }

    staff.SlotAvailability.splice(slotIndex, 1);
    console.log("Updated Staff", staff);

    this.staffService.update(staff.Id, staff, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Slot removed successfully!';
          this.success = true;

          this.fetchStaffs();
        } else {
          this.message = 'Failed to update staff: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        console.error('Error updating staff:', error);
        this.message = 'An error occurred while updating the staff!';
        this.success = false;
      });
  }


  goToAdmin() {
    this.router.navigate(['/admin']);
  }
  saveStaff() { }

}
