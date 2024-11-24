import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-technician-menu',
  templateUrl: './technician-menu.component.html',
  styleUrls: ['./technician-menu.component.css']
})
export class TechnicianMenuComponent implements OnInit {
  accessToken: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a technician! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
    
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('technician')) {
      this.authService.updateMessage(
        'You are not authenticated or are not a technician! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }
  }

  navigateTo(path: string) {
    this.router.navigateByUrl('/technician/' + path), { replaceUrl: true };
  }

  navigateTo3D(): void {
    window.location.href = environment.three_d_module;
  }
}