import {Component, EventEmitter, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MedicalConditionService} from '../../../services/medical-condition/medical-condition.service';

@Component({
  selector: 'app-download-history-form',
  templateUrl: './download-history-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './download-history-form.component.css'
})
export class DownloadHistoryFormComponent {
  showPasswordPopup = false;
  password = '';
  errorMessage = '';
  @Output() closeDownload = new EventEmitter<void>();

  constructor( private medicalConditionService: MedicalConditionService,) {}

  confirmPassword() {

  }
}
