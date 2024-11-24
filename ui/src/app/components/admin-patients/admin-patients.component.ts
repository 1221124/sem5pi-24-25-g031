import { Component, OnInit} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule, RouterOutlet} from '@angular/router';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { PatientsService} from '../../services/admin-patients/admin-patients.service';


@Component({
  selector: 'app-admin-patients',
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  templateUrl: './admin-patients.component.html',
  styleUrls: ['./admin-patients.component.css'],
})

export class AdminPatientsComponent implements OnInit {

  constructor(private patientService: PatientsService, private authService: AuthService, private router: Router) {}
  patients: any[] = [];
  filter = {
    pageNumber: 1,
    fullName: '',
    email: '',
    phoneNumber: '',
    medicalRecordNumber: '',
    dateOfBirth: '',
    gender: ''
  }
  selectedPatient: any = {
  };

  firstName: string = '';
  lastName: string = '';
  dateOfBirth: Date = new Date();
  gender: string = '';
  medicalRecordNumber: string = '';
  phoneNumber: string = '';
  email: string = '';
  medicalCondition: string = '';
  emergencyContact: string = '';
  appointmentHistory: string = '';
  userId: string = '';
  message: string | undefined;
  emailId: string = '';
  newCondition: string = '';
  formattedStart: string = '';
  editingSlotIndex: number | null = null;
  isAddSlotFormVisible = false;  // Controls visibility of the Add Slot form
  newSlotStart: string = '';  // To bind the start datetime of the new slot
  newSlotEnd: string = '';    // To bind the end datetime of the new slot

  currentPage: number = 1;
  totalPages: number = 1; // Total de páginas após o filtro
  itemsPerPage: number = 5;  // Número de itens por página

  firstNameTouched = false;
  lastNameTouched = false;
  dateOfBirthTouched = false;
  genderTouched = false;
  phoneNumberTouched = false;
  emailTouched = false;
  isEditModalOpen = false;
  isCreateModalOpen = false;
  isAppoitmentHistoryModalOpen = false;
  isDeleteModalOpen = false;

  accessToken: string = '';

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.accessToken = this.authService.getToken();
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.fetchPatients();
    if (this.selectedPatient.appointmentHistory) {
      this.selectedPatient.appointmentHistory.forEach((slot: { formattedStart: string; start: string | number | Date; }, i: any) => {
        slot.formattedStart = new Date(slot.start).toLocaleString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      });
    }
  }

  goToAdmin() {
    this.router.navigate(['/admin']);
  }

  // Atualiza a página atual para a nova página selecionada
  async changePage(pageNumber: number) {
    if (pageNumber > 0 && pageNumber <= this.totalPages) {
      this.filter.pageNumber = pageNumber;
      await this.refreshPatients();
    }
  }

  editPatient(patient: any) {
    this.selectedPatient = {
      emailId: patient.contactInformation.email,
      firstName: patient.fullName.firstName,
      lastName: patient.fullName.lastName,
      email: patient.contactInformation.email,
      phoneNumber: patient.contactInformation.phoneNumber,
      emergencyContact: patient.emergencyContact || {number: {value: ''} } ,
      appointmentHistory: patient.appointmentHistory.map((slot: any) => ({
        start: slot.start ? new Date(slot.start) : null,
        end: slot.end ? new Date(slot.end) : null
      }))
    };
    this.isEditModalOpen = true;
    this.isCreateModalOpen = false;
    this.isAppoitmentHistoryModalOpen = false;
  }

  // Method to add a condition to the appointment history
  addCondition() {
    this.selectedPatient.appointmentHistory.conditions.push({
      start: '',
      end: ''
    });
  }
  addSlot() {
    if (!this.selectedPatient.appointmentHistory) {
      this.selectedPatient.appointmentHistory = [];
    }

    // Only add a new slot if there is no ongoing slot creation
    const hasEmptySlot = this.selectedPatient.appointmentHistory.some(
        (slot: { start: string; end: string; }) => slot.start === '' && slot.end === ''
    );

    if (!hasEmptySlot) {
      this.selectedPatient.appointmentHistory.push({ start: '', end: '' });
      this.editingSlotIndex = this.selectedPatient.appointmentHistory.length - 1;
    }
  }

  // Add the new slot to the selected patient's appointment history
  addNewSlot() {
    if (this.newSlotStart && this.newSlotEnd) {
      // Create a new slot object
      const newSlot = {
        start: this.newSlotStart,
        end: this.newSlotEnd
      };

      // Add the new slot to the patient's appointment history
      if (!this.selectedPatient.appointmentHistory) {
        this.selectedPatient.appointmentHistory = [];
      }
      this.selectedPatient.appointmentHistory.push(newSlot);

      // Reset the form fields and hide the Add Slot form
      this.newSlotStart = '';
      this.newSlotEnd = '';
      this.isAddSlotFormVisible = false;
    } else {
      alert("Please select both start and end dates for the slot.");
    }
  }

  openAddSlotForm() {
    this.isAddSlotFormVisible = true;
  }

  // Method to save the updated patient data
  savePatient() {
    // Ensure valid Date objects for each slot
    this.selectedPatient.appointmentHistory = this.selectedPatient.appointmentHistory.map((slot: { start: Date; end: Date; }) => ({
      start: new Date(slot.start),
      end: new Date(slot.end)
    }));

    // Call the service to save the patient data
    this.patientService.updatePatient(this.selectedPatient, this.accessToken).subscribe(
      () => {
        this.isEditModalOpen = false;
        this.refreshPatients();  // Refresh to show updated data
      },
      error => console.error('Error updating patient:', error)
    );
  }

  // Method to refresh the list of patients
  async refreshPatients(){
    try {
      this.patients = await this.patientService.getFilterPatients(this.filter, this.accessToken).toPromise();
    } catch (error) {
      const httpError = error as HttpErrorResponse;
      if (httpError.status === 404 || httpError.status === 400) {
        this.patients = [];
        console.warn('No patients found or invalid filter parameters.');
      } else {
        console.error('Error refreshing patients:', error);
      }
    }
  }

  // Fetch all patients initially or apply the filter
  async fetchPatients(): Promise<void> {
    try {
      const data = await this.patientService.getPatients(this.accessToken).toPromise();
      this.patients = data.map((patient: { appointmentHistory: any[] }) => ({
        ...patient,
        appointmentHistory: patient.appointmentHistory.map(slot => ({
          start: new Date(slot.start),
          end: new Date(slot.end)
        }))
      }));
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  }

  applyFilter(): void {
    this.refreshPatients();
  }

  clearFilters(): void {
    this.filter = {
      pageNumber: 1,
      fullName: '',
      email: '',
      phoneNumber: '',
      medicalRecordNumber: '',
      dateOfBirth: '',
      gender: ''
    };
    this.fetchPatients();  // Fetch all patients again after clearing filters
  }


  createPatient() {
    console.log('Create button clicked');
    this.message = '';

    if (!this.isValidEmail(this.email)) {
      this.message = 'Invalid email format. Please provide a valid email.'
      return;
    }

    if (!this.isValidDate(this.dateOfBirth)) {
      this.message = 'Invalid date of birth. Please provide a valid date of birth.'
      return;
    }

    if(!this.isValidPhoneNumber(this.phoneNumber)) {
      this.message = 'Invalid phone number format. Please provide a valid phine number.'
    }

    this.patientService.post(this.firstName, this.lastName, this.dateOfBirth, this.email, this.phoneNumber, this.gender, this.accessToken);
    this.isCreateModalOpen = false;
    this.refreshPatients();
  }

  isValidEmail(email: string): boolean {
    const emailRegex = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');
    return emailRegex.test(email);
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    //const phoneNumberRegex = new RegExp(/^\s{9}$/);
    //return phoneNumberRegex.test(phoneNumber.toString());
    return true;
  }

  isValidDate(date: any): boolean {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return date instanceof Date && !isNaN(date.getTime());
  }

  clearForm() {
    console.log('Clear button clicked');
    this.firstName = '';
    this.lastName = '';
    this.dateOfBirth = new Date();
    this.phoneNumber = "";
    this.email = '';
    this.message = '';

    this.firstNameTouched = false;
    this.lastNameTouched = false;
    this.dateOfBirthTouched = false;
    this.genderTouched = false;
    this.phoneNumberTouched = false;
    this.emailTouched = false;
  }

  openCreatePatientModal() {
    this.selectedPatient = null;
    this.isCreateModalOpen = true;
    this.isEditModalOpen = false;
    this.isAppoitmentHistoryModalOpen = false;
  }

  openAppointmentHistoryModal(patient: any) {
    this.selectedPatient = {
      appointmentHistory: patient.appointmentHistory
    };
    this.isAppoitmentHistoryModalOpen = true;
    this.isEditModalOpen = false;
    this.isCreateModalOpen = false;
  }

  closeAppointmentHistoryModal() {
    this.isAppoitmentHistoryModalOpen = false;
  }

  closeCreatePatientModal() {
    this.isCreateModalOpen = false;
  }

  confirmDeletePatient(patient: any){
    this.isDeleteModalOpen = true;
    this.selectedPatient = patient;
  }

  deleteConfirmed() {
    if(this.selectedPatient){
      this.deletePatient(this.selectedPatient);
      this.closeDeleteModal();
      this.refreshPatients();
    }
  }

  deletePatient(patient: any) {
    if(this.selectedPatient){
      this.patientService.deletePatient(patient.id, this.accessToken).subscribe(
        () => {
          this.isDeleteModalOpen = false;
          this.refreshPatients();
        },
          (error: any) => console.error('Error deleting patient:', error)
      );
    }
  }
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedPatient = null;
  }
}
