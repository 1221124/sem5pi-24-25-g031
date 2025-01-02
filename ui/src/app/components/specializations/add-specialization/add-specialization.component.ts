import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Staff} from '../../../models/staff.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Specialization} from '../../../models/specialization.model';
import {StaffsService} from '../../../services/staffs/staffs.service';
import {AuthService} from '../../../services/auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-add-specialization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-specialization.component.html',
  styleUrl: './add-specialization.component.css'
})
export class AddSpecializationComponent implements OnInit {

  @Input() specialization!: Specialization;


  @Output() closeModalEvent = new EventEmitter<unknown>();

  @Output() createSpecializationEvent = new EventEmitter<Specialization>();

  nameTouched = false;
  descriptionTouched = false;
  codeTouched = false;
  SNOMEDCTCodeTouched = false;

  accessToken: string = '';

  constructor(private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {

    if (!this.specialization) {
      this.specialization = {
        Id: '',
        SNOMEDCTCode: '',
        Name: '',
        Description: ''
      };
    }

    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
  }

  closeCreateModal() {
    this.closeModalEvent.emit();
  }

  submitRequest() {
    this.createSpecializationEvent.emit(this.specialization);
  }

  clearForm() {
    this.codeTouched = false;
    this.nameTouched = false;
    this.descriptionTouched = false;
  }



}
