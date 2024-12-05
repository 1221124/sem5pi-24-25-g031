import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import './global-error-handler';
import { AuthService } from './services/auth/auth.service';
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SARM G031 Web Application';
  showLogoutButton: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.url.split('?')[0];
      this.showLogoutButton = currentUrl !== '/' && !currentUrl.startsWith('/callback');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}