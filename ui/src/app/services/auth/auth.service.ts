// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import jwtDecode from 'jwt-decode';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private apiUrl = 'http://localhost:5500/api/Users';

//   constructor(private http: HttpClient, private router: Router) {}

//   login(idToken: string, accessToken: string) {
//     this.http.post(`${this.apiUrl}/login`, { idToken, accessToken }).subscribe(response => {
//       const accessToken = response['accessToken'];

//       //Get role from accessToken
//       const role = jwtDecode(accessToken)['https://api.sarmg031.com/roles'][0];

//       localStorage.setItem('accessToken', accessToken);

//       this.redirectBasedOnRole(role);
//     }, error => {
//       console.error('Error during login:', error);
//     });
//   }

//   private redirectBasedOnRole(role: string) {
//     switch(role) {
//       case 'admin':
//         this.router.navigate(['/admin']);
//         break;
//       case 'doctor':
//       case 'nurse':
//       case 'technician':
//         this.router.navigate(['/staff']);
//         break;
//       case 'patient':
//         this.router.navigate(['/patient']);
//         break;
//       default:
//         this.router.navigate(['/']);
//         break;
//     }
//   }

//   logout() {
//     localStorage.removeItem('accessToken');
//     this.router.navigate(['/']);
//   }
// }