import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  redirectToLogin() {
    window.location.href = 'https://dev-sagir8s22k2ehmk0.us.auth0.com/authorize?audience=https://api.sarmg031.com&response_type=code&client_id=ZkqvMdGFLKP5d2DOlKCj8pnqDVihkffn&redirect_uri=http://localhost:5500/api/Users/callback&scope=openid%20profile%20email&prompt=login';
  }
}