import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StaffsService } from '../../services/staffs/staffs.service';
import { RouterModule } from '@angular/router';
import { DatePipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-staffs',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  templateUrl: './staffs.component.html',
  styleUrl: './staffs.component.css',
  providers: [StaffsService]
})
export class StaffsComponent {

  constructor(private staffService: StaffsService) { }

  staffs: any[] = [];
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  specialization: string = '';
  message: string = '';
  role: string = '';
  selectedStaff: any = null;
  filterText: string = '';

  searchName: string = '';
  searchEmail: string = '';
  searchSpecialization: string = '';
  currentPage: number = 1;
  totalPages: number = 1; // Total de páginas após o filtro
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

  ngOnInit() {
    this.refreshStaffs();
    this.staffs.forEach(staff => {
      staff.status = staff.status;
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

  // Função para escolher os funcionários filtrados
  getFilteredStaffs() {
    return this.staffs.filter(staff => {
      const fullName = `${staff.fullName?.firstName?.value || ""} ${staff.fullName?.lastName?.value || ""}`.toLowerCase();
      const email = staff.contactInformation?.email?.value.toLowerCase() || ""; // Use .value se necessário
      const specialization = staff.specialization?.toLowerCase() || "";

      return (
        fullName.includes(this.searchName.toLowerCase()) &&
        email.includes(this.searchEmail.toLowerCase()) &&
        specialization.includes(this.searchSpecialization.toLowerCase())
      );
    });
  }

  // Função para paginar os funcionários filtrados
  pagedStaffs() {
    // Filtra os staffs com base no nome, e-mail e especialização
    const filteredStaffs = this.staffs.filter(staff => {
      const fullName = `${staff.fullName?.firstName?.value || ""} ${staff.fullName?.lastName?.value || ""}`.toLowerCase();
      const email = staff.contactInformation.email?.value.toLowerCase() || "";
      const specialization = staff.specialization?.toLowerCase() || "";

      return (
        fullName.includes(this.searchName.toLowerCase()) &&
        email.includes(this.searchEmail?.toLowerCase() || "") &&
        specialization.includes(this.searchSpecialization?.toLowerCase() || "")
      );
    });

    // Calcula o total de páginas após o filtro
    this.totalPages = Math.ceil(filteredStaffs.length / this.itemsPerPage);

    // Pagina os resultados filtrados
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pagedStaffs = filteredStaffs.slice(startIndex, startIndex + this.itemsPerPage);

    return pagedStaffs;
  }

  // Atualiza a página atual para a nova página selecionada
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Aplicar filtro
  applyFilter() {
    this.currentPage = 1;
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

  // Method to refresh the list of patients
  refreshStaffs() {
    this.staffService.getStaff().subscribe(
      (data) => {
        this.staffs = data; // Update the patients list
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
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
      this.deleteStaff(this.selectedStaff);
      this.closeDeleteModal();
      this.refreshStaffs();
    }
  }

  deleteStaff(staff: any) {
    this.staffService.deleteStaff(staff.contactInformation.email.value).subscribe(
      () => {
        this.staffs = this.staffs.filter(s => s !== staff);
        this.refreshStaffs();
      },
      error => {
        console.error('Erro ao inativar o staff:', error);
      }
    );
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

  // Method to save the updated patient data
  saveStaff() {
    // Ensure valid Date objects for each slot
    this.selectedStaff.slotAvailability = this.selectedStaff.slotAvailability.map((slot: { start: Date; end: Date; }) => ({
      start: new Date(slot.start),
      end: new Date(slot.end)
    }));

    // Call the service to save the patient data
    this.staffService.editStaff(this.selectedStaff).subscribe(
      () => {
        this.isEditModalOpen = false;
        this.refreshStaffs();  // Refresh to show updated data
      },
      error => console.error('Error updating patient:', error)
    );
  }

  deleteSlotAvailability() {

  }

}