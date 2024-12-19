import { Component, Input, OnInit } from '@angular/core';
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

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  accessToken: string = '';
  
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
