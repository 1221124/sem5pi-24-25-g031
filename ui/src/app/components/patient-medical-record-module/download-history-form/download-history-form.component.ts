import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import { AuthService } from '../../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-download-history-form',
  templateUrl: './download-history-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrl: './download-history-form.component.css'
})
export class DownloadHistoryFormComponent implements OnInit {
  password = '';
  errorMessage = '';
  accessToken = '';

  @Output() download = new EventEmitter<string>();
  @Output() closeDownload = new EventEmitter<void>();

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage(
        'You are not authenticated or are not a patient! Please login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    const role = this.authService
      .extractRoleFromAccessToken(this.accessToken)
      ?.toLowerCase();

    if (
      !role?.includes('patient')
    ) {
      this.authService.updateMessage(
        'You are not authenticated or are not a patient! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    if (!this.route.fragment) {
      this.redirectToLogin();
    } else {
      this.router.navigate([], { fragment: null });
    }

  }

  redirectToLogin() {
    this.router.navigate([environment.downloadLoginUrl]);
  }

  async confirmPassword() {
    if (this.password) {
      const email = this.authService.extractEmailFromAccessToken(this.accessToken);
      const valid = await this.authService.authenticateWithCredentials(email, this.password);
      if (valid) {
        this.download.emit(this.accessToken);
      } else {
        this.errorMessage = 'Invalid password! Please try again...';
        this.password = '';
      }
    } else {
      this.errorMessage = 'Please provide a valid password!';
      this.password = '';
    }
  }
}