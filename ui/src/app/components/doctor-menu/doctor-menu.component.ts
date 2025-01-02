import { Component, OnInit } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-doctor-menu',
  templateUrl: './doctor-menu.component.html',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  styleUrls: ['./doctor-menu.component.css']
})
export class DoctorMenuComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthWithRole(['Doctor'])) {
      this.router.navigate(['']);
    }
  }

  navigateTo(path: string) {
    console.log("navigating to ", path);
    this.router.navigateByUrl('/doctor/' + path), { replaceUrl: true };
  }

  navigateTo3D(): void {
    window.location.href = environment.three_d_module;
  }
}
