import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.clearToken();
    }
  }

  redirectToLogin() {
    window.location.href = environment.loginUrl;
  }
}