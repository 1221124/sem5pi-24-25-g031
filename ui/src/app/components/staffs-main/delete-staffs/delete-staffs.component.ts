import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OperationType} from '../../../models/operation-type.model';
import {Staff} from '../../../models/staff.model';
import {StaffsService} from '../../../services/staffs/staffs.service';

@Component({
  selector: 'app-delete-staffs',
  templateUrl: './delete-staffs.component.html',
  standalone: true,
  styleUrl: './delete-staffs.component.css'
})
export class DeleteStaffsComponent {
  @Input() staff!: Staff;
  @Output() statusToggled = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  accessToken = '';
  constructor(private service: StaffsService) {}

  async toggleStatus() {
    try {
      if (this.staff.status.trim().toLowerCase() === 'active') {
        await this.service.deleteStaff(this.staff.Id, this.accessToken).then(() => {
          this.statusToggled.emit();
        });
      } else {
        await this.service.update(
          this.staff.Id,
          { ...this.staff, status: 'Active' },
          this.accessToken
        ).then(() => {
          this.statusToggled.emit();
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  }

  onCancel() {

  }
}
