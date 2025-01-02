import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffsService } from '../../../services/staffs/staffs.service';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Staff } from '../../../models/staff.model';
import { response } from 'express';
import { Console } from 'console';
import {OperationType} from '../../../models/operation-type.model';
import { ListStaffsComponent } from '../list-staffs/list-staffs.component';
import {
  CreateOperationRequestComponent
} from '../../operation-requests-main/create-operation-requests/create-operation-requests.component';
import {OperationRequest} from '../../../models/operation-request.model';
import {CreateStaffsComponent} from '../create-staffs/create-staffs.component';
import {UpdateStaffsComponent} from '../update-staffs/update-staffs.component';
import {
  OperationRequestsTableComponent
} from '../../operation-requests-main/operation-requests-table/operation-requests-table.component';
import {
  OperationTypesListComponent
} from '../../operation-types-module/operation-types-list/operation-types-list.component';
import {DeleteStaffsComponent} from '../delete-staffs/delete-staffs.component';
import {
  ToggleOperationTypeStatusComponent
} from '../../operation-types-module/toggle-operation-type-status/toggle-operation-type-status.component';
import { Specialization } from '../../../models/specialization.model';
import { SpecializationsService } from '../../../services/specializations/specializations.service';
import { EnumsService } from '../../../services/enums/enums.service';


@Component({
  selector: 'app-staffs',
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf, ListStaffsComponent, CreateStaffsComponent, UpdateStaffsComponent, OperationRequestsTableComponent, OperationTypesListComponent, DeleteStaffsComponent, ToggleOperationTypeStatusComponent],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css',
  standalone: true
})
export class StaffsComponent implements OnInit {
  @Output() updateStaffEvent = new EventEmitter<Staff>();
  @Output() selectedStaffToUpdate!: Staff;
  @Output() selectedStaffToCreate!: Staff;
  @Output() url: string | undefined;


  staffs: Staff[] = [];
  showList : boolean = false;
  showForm : boolean = false;

  totalItems: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  itemsPerPage: number = 1;
  showMessage: boolean = false;
  constructor(private staffService: StaffsService, private authService: AuthService, private enumsService: EnumsService, private specializationService: SpecializationsService, private router: Router, private route: ActivatedRoute) { }

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
    SlotAvailability: [
      {
        Start: '',
        End: ''
      }
    ]
  };

  selectedStaff: Staff | null = null;
  searchName: string = '';
  searchEmail: string = '';
  searchSpecialization: string = '';


  editingSlotAvailabilityIndex: number | null = null;
  isAddSlotAvailabilityFormVisible = false;  // Controls visibility of the Add Slot form
  newSlotStart: string = '';  // To bind the start datetime of the new slot
  newSlotEnd: string = '';    // To bind the end datetime of the new slot

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

  message: string = '';
  success: boolean = true;

  specializations: Specialization[] = [];
  roles: string[] = [];
  names: string[] = [];
  emails: string[] = [];

  showCreateForm: boolean = false;
  isEditMode: boolean = false;

  async ngOnInit() {
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    await this.enumsService.getStaffRoles(this.accessToken).then((data) => {
      this.roles = data;
    });

    await this.specializationService.getSpecializations(this.accessToken).then((data) => {
      this.specializations = data.body.specializations;
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
            console.log(this.totalItems);
            this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
            this.showList = true;
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



  async submitRequest(staff : Staff) {
    console.log("Staff:", staff);

    this.selectedStaffToCreate = staff;

    if (this.isEditMode) {
      console.log("Updating staff:", this.staff.Id);
      await this.update(this.selectedStaffToUpdate);
    } else {
      this.staffService.post(this.selectedStaffToCreate, this.accessToken)
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

  async update(staff: Staff) {

    await this.staffService.update(staff.Id, staff, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Staff successfully updated!';
          this.success = true;
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
    if(this.success) this.closeModal();
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
    console.log('Opening create modal...');
    this.selectedStaff = null;

    this.isCreateModalOpen = true;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.isEditMode = false;

    this.navigateTo('create', { queryParams: { request: JSON.stringify(this.selectedStaffToCreate) } });
  }

  openUpdateModal(staff: Staff) {
    console.log('Opening update modal...');

    this.selectedStaffToUpdate = staff;

    this.isEditModalOpen = true;
    this.navigateTo('update', { queryParams: { id: JSON.stringify(this.selectedStaffToUpdate.Id) } });
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
      specialization: this.filter.specialization.split(' - ')[0]
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
    this.selectedStaffToUpdate = staff;
    this.startEditStaff(staff, true);
    await this.update(staff);
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

 /* async editStaff(staff: Staff) {
    console.log("Open modal editing...");
    this.staff = JSON.parse(JSON.stringify(staff));
    console.log("Editing staff:", this.staff);

    await this.staffService.update(this.selectedStaffToUpdate.Id, this.staff, this.accessToken);



  }*/

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  async showStaffsList() {
    this.showForm = false;
    this.showMessage = true;
    this.message = "Activate with successfully.";
    this.staffs = [];
    this.selectedStaff = null;
    await this.fetchStaffs().then(() => {
      this.router.navigate(["/admin/staffs"], { queryParams: { page: 1 } });
      this.showList = true;
    });
  }


  navigateTo(route: string, options?: { queryParams?: any }) {
    this.router
      .navigate([route], {
        relativeTo: this.route,
        queryParams: options?.queryParams,
      })
      .then(r => console.log('Navigated to:', r))
      .catch(err => console.error('Navigation Error:', err));
  }

  onStatusToggle(staff: Staff) {
      this.selectedStaff = staff;
  }

  async onStatusToggled() {
    await this.showStaffsList();
  }

  async onCancel() {
    await this.showStaffsList();
  }

}
