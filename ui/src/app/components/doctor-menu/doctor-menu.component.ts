import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-doctor-menu',
  templateUrl: './doctor-menu.component.html',
  styleUrls: ['./doctor-menu.component.css']
})
export class DoctorMenuComponent implements OnInit {

  accessToken: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a doctor! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }

    this.accessToken = this.authService.getToken();
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('doctor')) {
      this.authService.updateMessage(
        'You are not authenticated or authorized! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }
  }

  navigateTo(path: string) {
    this.router.navigateByUrl('/doctor/' + path), { replaceUrl: true };
  }

  navigateTo3D(): void {
    window.location.href = environment.three_d_module;
  }
}