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
    if (!this.authService.isAuthWithRole(['Nurse'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;
  }

  navigateTo(path: string) {
    this.router.navigateByUrl('/nurse/' + path), { replaceUrl: true };
  }

  navigateTo3D(): void {
    window.location.href = environment.three_d_module;
  }
}