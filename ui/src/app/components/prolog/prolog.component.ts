import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import {Router, RouterModule} from '@angular/router';
import {PrologService} from '../../services/prolog/prolog.service';
import {Staff} from '../../models/staff.model';
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
  selectedRoom: string = '';
  selectedDate: string = '';

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
    await this.prologService.getSurgeryRooms().then((data) => {
      this.surgeryRooms = data;
    });

  }

  async runProlog() {
    if (!this.selectedRoom || !this.selectedDate) {
      alert('Please select a room and a date before submitting.');
      return;
    }
    await this.prologService.runProlog(this.selectedRoom, this.selectedDate).then((response) => {
      if (response.status === 200) {
        alert(`Appointments created for room ${this.selectedRoom} on ${this.selectedDate}!`);
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
    this.selectedRoom = '';
    this.selectedDate = '';
  }

}
