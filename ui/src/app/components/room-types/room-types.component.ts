import { NgIf, CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { RoomTypesService } from "../../services/room-types/room-types.service";
import { Router } from "@angular/router";
import { RoomType } from "../../models/room-type.model";

@Component({
  selector: 'app-room-types',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    CommonModule
  ],
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.css']
})
export class RoomTypesComponent implements OnInit {
  accessToken = '';

  roomType: RoomType = {
    Id: '',
    RoomTypeCode: '',
    Name: '',
    Description: '',
    AvailableForSurgeries: false
  };

  roomTypes: RoomType[] = [];

  showForm = false;

  message : string = '';
  isError : boolean = false;

  constructor(
    private service: RoomTypesService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

    await this.getRoomTypes();
  }

  async getRoomTypes() {
    await this.service.get(this.accessToken)
      .then((response) => {
        if (response.status === 200) {
          this.roomTypes = response.body.roomTypes;
        }
      }
    );
  }

  async submitForm() {
    await this.service.post(this.roomType, this.accessToken)
      .then((response) => {
        if (response.status === 201) {
          this.message = 'Room type added successfully!';
          this.isError = false;
        }
        setTimeout(() => {
          this.message = '';
          this.isError = false;
          this.router.navigate(['/admin/roomTypes']);
        }, 3000);
      })
      .catch((error) => {
        if (error.status === 400) {
          this.message = 'Something went wrong! Please try again...';
          this.isError = true;
          setTimeout(() => {
            this.message = '';
            this.isError = false;
            this.router.navigate(['/admin/roomTypes']);
          }, 3000);
        }
      });
  }

  isNameValid() {
    return this.roomType.Name !== ''
    && this.roomTypes.filter((roomType) => roomType.Name.trim().toLowerCase() === this.roomType.Name.trim().toLowerCase()).length === 0;
  }

  isFormValid(): boolean {
    return this.isNameValid()
    && this.roomType.AvailableForSurgeries !== undefined;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  back() {
    this.router.navigate(['/admin']);
  }
}