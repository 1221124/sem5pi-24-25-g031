import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-technician-menu',
  templateUrl: './technician-menu.component.html',
  styleUrls: ['./technician-menu.component.css']
})
export class TechnicianMenuComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigateByUrl('/technician/' + path), { replaceUrl: true };
  }
}