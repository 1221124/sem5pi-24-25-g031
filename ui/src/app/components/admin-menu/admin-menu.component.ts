import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css']
})
export class AdminMenuComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
  }

  navigateTo(path: string) {
    this.router.navigateByUrl('/admin/' + path), { replaceUrl: true };
  }

  navigateTo3D(): void {
    window.location.href = environment.three_d_module;
  }
}
