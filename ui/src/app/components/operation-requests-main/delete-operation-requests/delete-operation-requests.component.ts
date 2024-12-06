import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperationRequest } from '../../../models/operation-request.model';

@Component({
  selector: 'app-delete-operation-requests',
  templateUrl: './delete-operation-requests.component.html',
  standalone: true,
  styleUrls: ['./delete-operation-requests.component.css'],
})
export class DeleteOperationRequestsComponent {
  @Input() request!: OperationRequest;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<OperationRequest>();

  confirm() {
    this.delete.emit(this.request);
  }

  emitCloseModalEvent(){
    this.close.emit();
  }
}
