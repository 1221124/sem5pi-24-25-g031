import { Component, OnInit } from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
  imports: [

  ],
  standalone: true
})
export class AdminMenuComponent implements OnInit {

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }
  }

  navigateTo(path: string) {
    console.log('Navigating to:', path);
    this.router.navigateByUrl('/admin/' + path), { replaceUrl: true };
  }
}
