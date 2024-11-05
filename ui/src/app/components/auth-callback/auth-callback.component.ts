import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-callback',
  template: `<p>Processing your login...</p>`
})
export class AuthCallbackComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      
      if (code) {
        this.sendCodeToBackend(code);
      } else {
        console.error('Authorization code not found');
      }
    });
  }

  sendCodeToBackend(code: string): void {
    this.http.get(`http://localhost:5500/api/Users/callback?code=${code}`).subscribe({
      next: (response) => {
        // TODO: Handle response from backend
      },
      error: (err) => {
        console.error('Error processing code', err);
      }
    });
  }
}
