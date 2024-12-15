import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Staff} from '../../../models/staff.model';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-update-staffs',
  templateUrl: './update-staffs.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  styleUrl: './update-staffs.component.css'
})

export class UpdateStaffsComponent {
  @Input() staff!: Staff;
  @Input() specializations!: string[];

  @Output() update = new EventEmitter<Staff>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  closeModal() {
    this.closeModalEvent.emit();
  }

  saveStaff() {
    console.log('Updated request:', this.staff);

    this.update.emit(this.staff);
  }

}
