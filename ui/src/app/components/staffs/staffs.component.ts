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
  currentPage: number = 1;
  totalPages: number = 1; // Total de páginas após o filtro
  itemsPerPage: number = 5;  // Número de itens por página

  firstNameTouched = false;
  lastNameTouched = false;
  emailTouched = false;
  phoneNumberTouched = false;
  specializationTouched = false;
  isModalOpen = false;


  ngOnInit() {
    this.staffService.getStaff().subscribe(
      (data) => {
        //console.log('Fetched staffs:', data);
        this.staffs = data;
        //console.log('Staff loaded:, this.staffs');
      },
      (error) => {
        console.error('Error loading staffs:', error);
      }
    );
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
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  calculateTotalPages() {
    const filteredStaffs = this.getFilteredStaffs();
    this.totalPages = Math.ceil(filteredStaffs.length / this.itemsPerPage);
    // Garantir que a página atual não ultrapassa o total de páginas
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  // Função para escolher os funcionários filtrados
  getFilteredStaffs() {
    return this.staffs.filter(staff =>
      `${staff.fullName.firstName.value} ${staff.fullName.lastName.value}`
        .toLowerCase()
        .includes(this.searchName.toLowerCase())
    );
  }

  pagedStaffs() {
    // Filtra os staffs com base no nome (First Name + Last Name)
    const filteredStaffs = this.staffs.filter(staff =>
      `${staff.fullName.firstName.value} ${staff.fullName.lastName.value}`
        .toLowerCase()
        .includes(this.searchName.toLowerCase())
    );

    // Calcula o total de páginas após o filtro
    this.totalPages = Math.ceil(filteredStaffs.length / this.itemsPerPage);

    // Pagina os resultados filtrados
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const pagedStaffs = filteredStaffs.slice(startIndex, startIndex + this.itemsPerPage);

    return pagedStaffs;
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Aplicar filtro
  applyFilter() {
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  editStaff(staff: any): void {
    // Lógica de edição
  }

  deleteStaff(staff: any): void {
    // Lógica de exclusão
  }



}