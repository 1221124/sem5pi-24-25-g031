import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Patient} from '../../../models/patient.model';
import {PatientService} from '../../../services/patient/patient.service';

@Component({
  selector: 'app-delete-account-button',
  templateUrl: './delete-account-button.component.html',
  styleUrls: ['./delete-account-button.component.css'],
  imports: [
    FormsModule,
    CommonModule
  ],
  standalone: true
})

export class DeleteAccountButtonComponent{
  @Input() patient!: Patient;
  @Input() accessToken!: string;

  message: string = '';
  success: boolean = true;

  isModalOpen: boolean = false;

  constructor(
    private patientService: PatientService
  ) {}

  async deletePatient() {
    if (!this.patient) return;

    await this.patientService.deletePatient(this.patient.Id, this.accessToken)
      .then((response) => {
        if (response.status === 200) {
          this.message = 'Patient deleted successfully!';
          this.success = true;
          this.closeDeleteModal();
        } else {
          this.handleError('Failed to delete patient-main. Response status: ' + response.status);
        }
      })
      .catch((error) => {
        this.handleError('Error deleting patient-main: ' + error.message);
      });
  }

  private handleError(message: string) {

  }

  openDeleteModal() {
    this.isModalOpen = true;
  }

  // Fechar o modal
  closeDeleteModal() {
    this.isModalOpen = false;
  }
}
