import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Staff} from '../../models/staff.model';

@Component({
  selector: 'app-slot',
  templateUrl: './slot.component.html',
  standalone: true,
  styleUrl: './slot.component.css'
})
export class SlotComponent {
  @Output() openSlotAppointmentModal = new EventEmitter<Staff>();
  @Input() Staff!: Staff;

}
