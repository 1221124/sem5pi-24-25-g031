import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {HttpHeaders, HttpParams} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-specializations',
  standalone: true,
  imports: [ListSpecializationComponent, AddSpecializationComponent, CommonModule, FormsModule],
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.css'
})
export class SpecializationsComponent implements OnInit {

  @Output() selectedSpecializationToCreate!: Specialization
  @Output() selectedSpecializationToUpdate!: Specialization

  isCreateModalOpen = false;

  specialization: Specialization = {
    Id: '',
    SNOMEDCTCode: '',
    Name: '',
    Description: '',
  };

  filter = {
    pageNumber: 1,
    SNOMEDCTCode: '',
    Name: '',
    Description: ''
  }

  totalItems: number = 0;
  totalPages: number = 1;
  currentPage: number = 1;
  itemsPerPage: number = 1;

  specializations: Specialization[] = [];

  message : string = '';
  isError : boolean = false;
  isEditMode: boolean = false;

  success: boolean = true;

  accessToken: string = '';
  showList : boolean = false;

  constructor(
    private service: SpecializationsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute) { }

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage(
        'You are not authenticated or are not an admin! Redirecting to login...'
      );
      this.authService.updateIsError(true);
      this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;
    await this.fetchSpecialization();

  }

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


  async submitRequest(specialization : Specialization) {
    console.log("Specialization:", specialization);

    this.selectedSpecializationToCreate = specialization;

    //this.selectedSpecializationToCreate.SNOMEDCTCode = "CT2";  // Remove o código antes de enviar


    if (this.isEditMode) {
      console.log("Updating staff:", this.specialization.Id);
      await this.update(this.specialization);
    } else {

      console.log("Entrou");
      this.service.post(this.selectedSpecializationToCreate, this.accessToken)
        .then(response => {
          if (response.status === 201) {
            this.message = 'Staff successfully created!';
            this.success = true;
            this.closeModal();
            this.fetchSpecialization();
            setTimeout(() => {
              this.success = false;
            }, 3000);
          } else {
            this.message = 'Unexpected response status: ' + response.status;
            this.success = false;
          }
        })
        .catch(error => {
          if (error.status === 401) {
            this.message = 'You are not authorized to create Staff! Please log in...';
            this.success = false;
            setTimeout(() => {
              this.router.navigate(['']);
            }, 3000);
            return;
          } else if (error.status == 400) {
            this.message = 'Bad Request... ' + error;
          }
          this.message = 'There was an error creating the Staff: ' + error;
          this.success = false;
        });

      console.log(this.selectedSpecializationToCreate);
      await this.fetchSpecialization();
    }
  }

  async update(specialization: Specialization) {

    await this.service.update(specialization.Id, specialization, this.accessToken)
      .then(response => {
        if (response.status === 200) {
          this.message = 'Staff successfully updated!';
          this.success = true;
        } else {
          this.message = 'Unexpected response status: ' + response.status;
          this.success = false;
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.message = 'You are not authorized to update Staffs! Please log in...';
          this.success = false;
          setTimeout(() => {
            this.router.navigate(['']);
          }, 3000);
          return;
        }
        this.message = 'There was an error updating the Staff: ' + error;
        this.success = false;
      });
    if(this.success) this.closeModal();
    await this.fetchSpecialization();
  }

  private async fetchSpecialization() {
    await this.service.getSpecializations(this.accessToken)
      .then((response) => {
          if (response.status === 200) {
            this.specializations = response.body.specializations;
          }
        }
      );
  }
}
