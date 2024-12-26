import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Allergy} from '../../../models/allergy.model';

@Component({
  selector: 'app-update-allergy',
  templateUrl: './update-allergy.component.html',
  standalone: true,
  imports: [
    NgIf,
    FormsModule
  ],
  styleUrl: './update-allergy.component.css'
})
export class UpdateAllergyComponent implements OnInit{
  @Input() allergy!: Allergy;

  @Output() close = new EventEmitter<unknown>();
  @Output() update = new EventEmitter<Allergy>();

  isProcessing: boolean = false;

  message: string = '';
  success: boolean = false;

  updatedDescription: string = '';

  ngOnInit() {
    if (!this.allergy) {
      console.error('allergy is not defined.');
      return;
    }

    this.updatedDescription = this.allergy.description;
  }

  submit() {
    this.isProcessing = true;
    this.success = false;
    this.message = 'Updating allergy...';


    if(this.updatedDescription !== this.allergy.description && this.updatedDescription != '') this.allergy.description = this.updatedDescription;

    this.isProcessing = false;
    this.success = true;
    this.message = 'Allergy updated successfully!';

    this.update.emit(this.allergy);
  }

  adjustHeight(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }

}
