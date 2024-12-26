import { Component, Output} from '@angular/core';
import {Allergy} from '../../../models/allergy.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {AllergyService} from '../../../services/allergy/allergy.service';
import {CreateAllergyComponent} from '../create-allergy/create-allergy.component';
import {NgIf} from '@angular/common';
import {AllergyTableComponent} from '../allergy-table/allergy-table.component';
import {start} from 'node:repl';

@Component({
  selector: 'app-allergy',
  templateUrl: './allergy.component.html',
  styleUrl: './allergy.component.css',
  standalone: true,
  imports: [
    NgIf,
    CreateAllergyComponent,
    AllergyTableComponent,
  ]
})
export class AllergyComponent {
  @Output() allergies: Allergy[];
  @Output() selectedAllergyToUpdate!: Allergy;
  @Output() selectedAllergyToDelete!: Allergy;
  @Output() selectedAllergyToCreate!: Allergy;

  constructor(
    private service: AllergyService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  accessToken: string = '';
  message = '';
  success = false;

  isCreateModalOpen = false;
  isDeleteModalOpen = false;
  isUpdateModalOpen = false;

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.authService.updateMessage('You are not authenticated or are not an admin! Please login...');
      this.authService.updateIsError(true);
      await this.router.navigate(['']);
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
      this.authService.updateMessage('You are not an admin! Redirecting to login...');
      this.authService.updateIsError(true);
      await this.router.navigate(['']);
      return;
    }

    try {
      await this.loadInitialData();
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  }

  async loadInitialData(filters?: { code?: string; name?: string; description?: string }) {

    const response = await this.service.get(this.accessToken, filters);

    if(response.status !== 200){
      this.message = 'Error loading allergies!';
      this.success = false;
      return;
    }

    this.allergies = response.body.map((allergy: Allergy) => {
      return {
        id: allergy.id,
        code: allergy.code,
        name: allergy.name,
        description: allergy.description
      }
    });

  }

  openCreateModal() {
    this.isCreateModalOpen = true;
    this.selectedAllergyToCreate= {
      id: '',
      code: '',
      name: '',
      description: ''
    };

    this.navigateTo('create');
  }

  async createAllergy(){
    try {
      const response = await this.service.post(this.accessToken, this.selectedAllergyToCreate);

      if (response.status !== 201 || !response.body) {
        this.message = 'Error creating allergy!';
        this.success = false;
        return;
      }

      this.allergies = [{
        id: response.body.id,
        code: response.body.code,
        name: response.body.name,
        description: response.body.description
      }];

      this.message = 'Allergy created successfully!';
      this.success = true;
    } catch (error) {
      console.error('Error creating allergy:', error);
      this.message = 'Error creating allergy!';
      this.success = false;
    } finally {
      if (this.success){
        await this.loadInitialData();
        this.closeCreateModal();
      } else {
        console.error('Error creating allergy:', this.message);
      }
    }
  }

  closeCreateModal() {
    this.isCreateModalOpen = false;
    this.selectedAllergyToCreate = {
      id: '',
      code: '',
      name: '',
      description: ''
    };
  }


  navigateTo(route: string, options?: { queryParams: any }) {
    this.router
      .navigate([route], {
        relativeTo: this.route,
        queryParams: options?.queryParams,
      })
      .then (r => console.log('Navigated to:', r))
      .catch (e => console.error('Error navigating:', e));
  }

  navigateToAdminMenu(){
    this.router.navigate(['admin']).then(r => console.log('Navigated to admin menu:', r)).catch(e => console.error('Error navigating to admin menu:', e));
  }

  navigateToAllergy(){
    this.router.navigate(['admin/allergy']).then(r => console.log('Navigated to allergy:', r)).catch(e => console.error('Error navigating to allergy:', e));
  }

}
