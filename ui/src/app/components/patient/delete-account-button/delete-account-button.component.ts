import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {Patient} from '../../../models/patient.model';
import {PatientService} from '../../../services/patient/patient.service';
import {Router} from '@angular/router';

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
  @Output() patientDeleted = new EventEmitter<Patient>();

  message: string = '';
  success: boolean = true;

  isModalOpen: boolean = false;
  tempEmail: string = '';
  tempPhoneNumber: string = '';

  showNotification: boolean = false;

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  async deletePatient() {
    if (!this.patient) return;

    await this.patientService.deletePatient(this.patient.Id, this.accessToken)
      .then((response) => {
        if (response.status === 200) {
          this.message = 'Patient deleted successfully!';
          this.success = true;
          this.patient = { ...this.patient };
          this.patientDeleted.emit(this.patient);
          this.showNotification = true;
          this.closeDeleteModal();
          this.hideNotificationAfterDelay();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 5000);
        } else {
          this.displayError('Failed to delete patient profile.');
          this.closeDeleteModal();
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 5000);
        }
      })
      .catch((error) => {
        this.displayError('Error updating patient information: ' + error.message);
      });
  }

  openDeleteModal() {
    this.isModalOpen = true;
  }

  closeDeleteModal() {
    this.isModalOpen = false;
  }


  displayError(errorMessage: string) {
    this.success = false;
    this.message = errorMessage;
    this.showNotification = true;
    this.hideNotificationAfterDelay();
  }

  hideNotificationAfterDelay() {
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }
}
