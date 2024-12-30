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
  errorMessage = '';
  accessToken = '';
  beforeLogin = true;

  @Output() download = new EventEmitter<void>();
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

    const fragmentContent = this.route.snapshot.fragment;
    if (fragmentContent) {
      this.emitDownload();
    }

  }

  redirectToLogin() {
    window.location.href = `${environment.downloadLoginUrl}`;
  }

  emitDownload() {
    this.beforeLogin = false;
    console.log('Fragment found!');
    console.log(this.route.fragment);
    const token = this.route.snapshot.fragment.split('=')[1].split('&')[0];
    const emailFromToken = this.authService.extractEmailFromAccessToken(token);
    const emailFromAccessToken = this.authService.extractEmailFromAccessToken(this.accessToken);
    console.log('Token: ', token);
    console.log('Email from token: ', emailFromToken);
    if (emailFromToken.trim().toLowerCase() !== emailFromAccessToken.trim().toLowerCase()) {
      console.log('Emails do not match!');
      window.location.href = `${environment.homeUrl}`;
      return;
    }
    this.router.navigate([], { fragment: null });
    this.download.emit();
  }
}