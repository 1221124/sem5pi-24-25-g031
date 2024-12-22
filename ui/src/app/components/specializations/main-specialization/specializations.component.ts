import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AuthService} from "../../../services/auth/auth.service";
import {ListSpecializationComponent} from "../list-specialization/list-specialization.component";
import {AddSpecializationComponent} from "../add-specialization/add-specialization.component";
import {CreateStaffsComponent} from "../../staffs-main/create-staffs/create-staffs.component";
import {Staff} from "../../../models/staff.model";
import {Specialization} from "../../../models/specialization.model";
import {SpecializationsService} from "../../../services/specializations/specializations.service";
import {RoomType} from "../../../models/room-type.model";

@Component({
  selector: 'app-specializations',
  standalone: true,
  imports: [ListSpecializationComponent, AddSpecializationComponent, CommonModule, FormsModule],
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css'
})
export class SpecializationsComponent {

  @Output() selectedSpecializationToCreate!: Specialization

  isCreateModalOpen = false;

  accessToken: '';

  specialization: Specialization = {
    Id: '',
    SNOMEDCTCode: '',
    Name: '',
    Description: '',
  };

  specializations: Specialization[] = [];

  message : string = '';
  isError : boolean = false;

  constructor(private service: SpecializationsService, private router: Router, private route: ActivatedRoute) { }

  closeModal() {
    this.isCreateModalOpen = false;
  }

  openModal() {
    console.log('Opening create modal...');

    this.isCreateModalOpen = true;

    this.navigateTo('create', { queryParams: { request: JSON.stringify(this.selectedSpecializationToCreate) } });
  }

  navigateTo(route: string, options?: { queryParams?: any }) {
    this.router
      .navigate([route], {
        relativeTo: this.route,
        queryParams: options?.queryParams,
      })
      .then(r => console.log('Navigated to:', r))
      .catch(err => console.error('Navigation Error:', err));
  }


  async submitRequest(specialization: Specialization) {
    console.log("Specialization:", specialization);
    await this.service.post(this.specialization, this.accessToken)
        .then((response) => {
          if (response.status === 201) {
            this.message = 'Specialization added successfully!';
            this.isError = false;
          }
          setTimeout(() => {
            this.message = '';
            this.isError = false;
            this.router.navigate(['/admin/specializations']);
          }, 3000);
        })
        .catch((error) => {
          if (error.status === 400) {
            this.message = 'Something went wrong! Please try again...';
            this.isError = true;
            setTimeout(() => {
              this.message = '';
              this.isError = false;
              this.router.navigate(['/admin/specializations']);
            }, 3000);
          }
        });
  }
}
