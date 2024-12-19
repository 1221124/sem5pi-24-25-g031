import { NgForOf, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicalCondition } from '../../../models/medical-condition.model';

@Component({
  selector: 'app-update-medical-condition',
  templateUrl: './update-medical-condition.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./update-medical-condition.component.css']
})
export class UpdateMedicalConditionComponent {
  @Input() medicalCondition!: MedicalCondition;
}
