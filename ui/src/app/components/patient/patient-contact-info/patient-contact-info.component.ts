import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Patient} from '../../../models/patient.model';
import {PatientService} from '../../../services/patient/patient.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-patient-contact-info',
  templateUrl: './patient-contact-info.component.html',
  styleUrls: ['./patient-contact-info.component.css'],
  imports: [
    CommonModule,
    FormsModule
  ],
  standalone: true
})

export class PatientContactInfoComponent {
  @Input() patient!: Patient;
  @Input() accessToken!: string
  @Output() patientUpdated = new EventEmitter<Patient>();

  message: string = '';
  success: boolean = true;

  isModalOpen: boolean = false;
  tempEmail: string = '';
  tempPhoneNumber: string = '';

  showNotification: boolean = false;

  constructor(
    private patientService: PatientService) {}

  async saveChanges() {
    if (!this.patient || !this.accessToken) return;

    const updatedPatient: Patient = {
      ...this.patient,
      ContactInformation: {
        Email: this.tempEmail,
        PhoneNumber: parseInt(this.tempPhoneNumber, 10)
      }
    };

    await this.patientService
      .update(updatedPatient, this.patient.ContactInformation.Email, this.accessToken)
      .then((response) => {
        if (response.status === 200) {
          this.success = true;
          this.message = 'Patient information updated successfully!';
          this.patient = { ...updatedPatient };
          this.patientUpdated.emit(updatedPatient);
          this.showNotification = true;
          this.closeEditModal();
          this.hideNotificationAfterDelay();
        } else {
          this.displayError('Failed to update patient information.');
        }
      })
      .catch((error) => {
        this.displayError('Error updating patient information: ' + error.message);
      });
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
    }, 5000); // Notificação desaparece após 5 segundos
  }

  openEditModal() {
    this.tempEmail = this.patient.ContactInformation.Email || '';
    this.tempPhoneNumber = this.patient.ContactInformation.PhoneNumber.toString() || '';
    this.isModalOpen = true;
  }

  // Fechar o modal
  closeEditModal() {
    this.isModalOpen = false;
    this.tempEmail = '';
    this.tempPhoneNumber = '';
  }

}
