import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {Router, RouterModule} from '@angular/router';
import {PrologService} from '../../services/prolog/prolog.service';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  selector: 'app-prolog',
  templateUrl: './prolog.component.html',
  styleUrl: './prolog.component.css'
})
export class PrologComponent implements OnInit {

  surgeryRooms: string[] = [];

  surgeryRoom: string = '';
  surgeryDate: string = '';

  constructor(private authService: AuthService, private prologService: PrologService, private router: Router) { }

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not a prolog! Please login...');
      this.authService.updateIsError(true);
      setTimeout(() => {
        this.router.navigate(['']);
      }, 3000);
      return;
    }
    await this.fetchSurgeryRooms();

  }

  async fetchSurgeryRooms() {
    try {
      this.surgeryRooms = await this.prologService.getSurgeryRooms();
    } catch (error) {
      alert('Error fetching surgery room numbers: ' + error);
    }
  }

  async runProlog() {
    if (!this.surgeryRoom || !this.surgeryDate) {
      alert('Please select a room and a date before submitting.');
      return;
    }
    await this.prologService.runProlog(this.surgeryRoom, this.surgeryDate).then((response) => {
      if (response.status === 200) {
        alert(`Appointments created for room ${this.surgeryRoom} on ${this.surgeryDate}! Check the appointments page for more details.`);
      } else {
        alert('Unexpected response status: ' + response.status);
      }
    }).catch((error) => {
      if (error.status == 400) {
        alert('Bad request while creating appointments: ' + error.error);
      }
      alert('Error creating appointments: ' + error);
    });
    this.clearForm();
  }

  clearForm() {
    this.surgeryRoom = '';
    this.surgeryDate = '';
  }

}
