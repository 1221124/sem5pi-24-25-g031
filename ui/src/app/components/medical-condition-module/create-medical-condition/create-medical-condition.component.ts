import { NgForOf, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-create-medical-condition',
  templateUrl: './create-medical-condition.component.html',
  styleUrl: './create-medical-condition.component.css',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
  ],
  providers: []
})
export class CreateMedicalConditionComponent implements OnInit {
  @Input() medicalCondition!: MedicalCondition;
  @Output() createNewMedicalConditionEvent = new EventEmitter<MedicalCondition>();
  @Output() closeModalEvent = new EventEmitter<unknown>();

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
      private router: Router
  ){}

  accessToken: string = '';
  success: boolean = false;
  message: string = '';

  isProcessing: boolean = false;
  
  codeTouched: boolean = false;
  nameTouched: boolean = false;
  descriptionTouched: boolean = false;
  commonSymptomsTouched: boolean = false;

  ngOnInit() {
    // Authentication checks
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }  
  }
}
