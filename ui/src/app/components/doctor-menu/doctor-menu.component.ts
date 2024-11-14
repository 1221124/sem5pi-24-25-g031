import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-doctor-menu',
  templateUrl: './doctor-menu.component.html',
  styleUrls: ['./doctor-menu.component.css']
})
export class DoctorMenuComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigateByUrl('/doctor/' + path), { replaceUrl: true };
  }
}