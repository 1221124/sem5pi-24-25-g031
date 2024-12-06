import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OperationRequest } from '../../../models/operation-request.model';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-update-operation-requests',
  templateUrl: './update-operation-requests.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  styleUrls: ['./update-operation-requests.component.css']
})
export class UpdateOperationRequestsComponent {
  @Input() request!: OperationRequest;
  @Input() priorities!: string[];
  @Input() statuses!: string[];

  @Output() close = new EventEmitter<unknown>();
  @Output() update = new EventEmitter<OperationRequest>();

  date: string = '';
  priority: string = '';
  status: string = '';

  submit() {

    this.request.deadlineDate = this.date;
    this.request.priority = this.priority;
    this.request.status = this.status;

    console.log('Updated request:', this.request);

    this.update.emit(this.request);
  }

  emitCloseModalEvent(){
    this.close.emit();
  }
}
