import {Component, OnInit} from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { PrologService } from '../../services/prolog/prolog.service';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { SurgeryRoomsService } from '../../services/surgery-rooms/surgery-rooms.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterModule, NgIf, DatePipe, NgForOf],
  selector: 'app-prolog',
  templateUrl: './prolog.component.html',
  styleUrls: ['./prolog.component.css']
})
export class PrologComponent implements OnInit {

  surgeryRooms: string[] = [];
  surgeryRoom: string = '';
  surgeryDate: string = '';
  accessToken: string = '';
  minDate: string = '';
  isSpecificRoomSelected: boolean = false;
  loading = false;

  constructor(
    private authService: AuthService, 
    private prologService: PrologService, 
    private surgeryRoomService: SurgeryRoomsService, 
    private router: Router
  ) { }

  async ngOnInit() {
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];

    await this.fetchSurgeryRooms();
  }

  async fetchSurgeryRooms() {
    try {
      if (this.surgeryRooms.length == 0) {
        const rooms = await this.surgeryRoomService.get(this.accessToken);
        this.surgeryRooms = rooms.body.surgeryRooms.map((room: { SurgeryRoomNumber: any; }) => room.SurgeryRoomNumber);
        this.surgeryRooms.sort();
      }
    } catch (error) {
      alert('Error fetching surgery room numbers: ' + error);
    }
  }

  isDateValid(): boolean {
    const selectedDate = new Date(this.surgeryDate);
    const today = new Date();
    return selectedDate > today;
  }

  areButtonsEnabled(): boolean {
    if (!this.isDateValid()) return false;
    if (this.isSpecificRoomSelected && !this.surgeryRoom) return false;
    return true;
  }

  onRoomSelectionChange() {
    if (!this.isSpecificRoomSelected) {
      this.surgeryRoom = '';
    }
  }

  async runProlog(option: any) {
    if (!this.surgeryDate || !this.isDateValid) {
      alert('Please select a valid date (in the future)!');
      return;
    }
    
    this.loading = true;

    await this.prologService.runProlog(option, this.surgeryRoom, this.surgeryDate, this.accessToken).then((response) => {
      this.loading = false;
      if (response.status === 201) {
        alert(`Appointments created successfully!`);
        this.router.navigate(['/admin/appointments']);
      } else if (response.status === 204) {
        alert('No operation requests needing scheduling or appointments not created due to staff or room\'s inavailability!');
        this.router.navigate(['/admin/appointments']);
      } else {
        alert('Unexpected response status: ' + response.status);
      }
    }).catch((error) => {
      this.loading = false;
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
    this.isSpecificRoomSelected = false;
  }

  back() {
    this.router.navigate(['/admin']);
  }
}