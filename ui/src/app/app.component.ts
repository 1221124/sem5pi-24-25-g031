import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import './global-error-handler';
import { AuthService } from './services/auth/auth.service';
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { marked } from 'marked';

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

  showPrivacyPolicy: boolean = false;
  privacyPolicyHtml: string = '';

  constructor(private authService: AuthService, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentUrl = event.url.split('?')[0];
      this.showLogoutButton = currentUrl !== '/' && !currentUrl.startsWith('/callback');
    });
    this.loadPrivacyPolicy();
  }

  loadPrivacyPolicy(): void {
    this.http.get('assets/privacy-policy.md', { responseType: 'text' })
      .subscribe((markdownContent: string) => {
        const result = marked(markdownContent);
        if (result instanceof Promise) {
          result.then(html => {
            this.privacyPolicyHtml = html;
          });
        } else {
          this.privacyPolicyHtml = result;
        }
      });
  }

  openPrivacyPolicy(): void {
    this.showPrivacyPolicy = true;
  }

  closePrivacyPolicy(): void {
    this.showPrivacyPolicy = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['']);
  }
}