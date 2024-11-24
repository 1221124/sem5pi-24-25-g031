import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-nurse-menu',
  templateUrl: './nurse-menu.component.html',
  styleUrls: ['./nurse-menu.component.css']
})
export class NurseMenuComponent implements OnInit {

  accessToken: string = '';

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a nurse! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }

    this.accessToken = this.authService.getToken();
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('nurse')) {
      this.authService.updateMessage(
        'You are not authenticated or are not a nurse! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);

      return;
    }
  }

  navigateTo(path: string) {
    this.router.navigateByUrl('/nurse/' + path), { replaceUrl: true };
  }

  navigateTo3D(): void {
    window.location.href = environment.three_d_module;
  }
}