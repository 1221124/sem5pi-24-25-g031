import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nurse-menu',
  templateUrl: './nurse-menu.component.html',
  styleUrls: ['./nurse-menu.component.css']
})
export class NurseMenuComponent {
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigateByUrl('/nurse/' + path), { replaceUrl: true };
  }
}