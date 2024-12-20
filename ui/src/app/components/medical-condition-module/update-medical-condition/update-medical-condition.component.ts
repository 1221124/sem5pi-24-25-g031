import { NgForOf, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class UpdateMedicalConditionComponent implements OnInit {
  @Input() medicalCondition!: MedicalCondition;

  @Output() close = new EventEmitter<unknown>();
  @Output() update = new EventEmitter<MedicalCondition>();

  isProcessing: boolean = false;

  message: string = '';
  success: boolean = false;

  updatedDescription: string = '';

  editableCommonSymptoms: string[] = [];

  ngOnInit() {
    if (!this.medicalCondition) {
      console.error('medicalCondition is not defined.');
      return;
    }

    this.updatedDescription = this.medicalCondition.description;
    this.editableCommonSymptoms = [...this.medicalCondition.commonSymptoms];
  }

  submit() {
    this.isProcessing = true;
    this.success = false;
    this.message = 'Updating medical condition...';

    // Sync changes back to medicalCondition
    if(this.updatedDescription !== this.medicalCondition.description && this.updatedDescription != '') this.medicalCondition.description = this.updatedDescription;
    
    this.editableCommonSymptoms = this.editableCommonSymptoms.filter(element => element !== '');
    this.medicalCondition.commonSymptoms = [...this.editableCommonSymptoms];
    
    console.log('Updated medical condition:', this.medicalCondition);

    this.isProcessing = false;
    this.success = true;
    this.message = 'Medical condition updated successfully!';

    this.update.emit(this.medicalCondition);
  }

  trackByIndex(index: number, item: string): number {
    return index;
  }
} 