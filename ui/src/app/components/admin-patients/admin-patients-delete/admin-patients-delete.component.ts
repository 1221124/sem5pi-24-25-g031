import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Patient} from '../../../models/patient.model';

@Component({
  selector: 'app-admin-patients-delete',
  templateUrl: './admin-patients-delete.component.html',
  standalone: true,
  styleUrl: './admin-patients-delete.component.css'
})
export class AdminPatientsDeleteComponent {
  @Input() patient!: Patient;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<Patient>();
}
