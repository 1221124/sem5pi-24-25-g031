import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-delete-medical-condition',
  templateUrl: './delete-medical-condition.component.html',
  styleUrls: ['./delete-medical-condition.component.css'],
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule
  ],
  providers: []

})
export class DeleteMedicalConditionComponent implements OnInit {
  @Input() medicalCondition!: MedicalCondition;

  @Output() confirmDeleteEvent = new EventEmitter();
  @Output() closeDeleteEvent = new EventEmitter();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  accessToken: string = '';
  
  ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
  }

  confirmDelete() {
    this.confirmDeleteEvent.emit(this.medicalCondition);
  }

  closeDelete() {
    this.closeDeleteEvent.emit();
  }

}
