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

  submitRequest() {
    if (!this.selectedRoom || !this.selectedDate) {
      alert('Please select a room and a date before submitting.');
      return;
    }
    console.log('Room:', this.selectedRoom, 'Date:', this.selectedDate);
    alert(`Appointment created for room ${this.selectedRoom} on ${this.selectedDate}`);
  }

  clearForm() {
    this.selectedRoom = '';
    this.selectedDate = '';
  }

}
