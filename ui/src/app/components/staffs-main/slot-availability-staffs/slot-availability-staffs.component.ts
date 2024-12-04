import { Component, Input } from '@angular/core';
import {Staff} from '../../../models/staff.model';

@Component({
  selector: 'app-slot-availability-staffs',
  templateUrl: './slot-availability-staffs.component.html',
  styleUrl: './slot-availability-staffs.component.css'
})
export class SlotAvailabilityStaffsComponent {
  @Input() staff: Staff;
}
