import { Component, Output} from '@angular/core';
import {Allergy} from '../../../models/allergy.model';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth/auth.service';
import {AllergyService} from '../../../services/allergy/allergy.service';
import {CreateAllergyComponent} from '../create-allergy/create-allergy.component';
import {NgIf} from '@angular/common';
import {AllergyTableComponent} from '../allergy-table/allergy-table.component';
import {UpdateAllergyComponent} from '../update-allergy/update-allergy.component';
import {DeleteAllergyComponent} from '../delete-allergy/delete-allergy.component';
import {response} from 'express';

@Component({
  selector: 'app-allergy',
  templateUrl: './allergy.component.html',
  styleUrl: './allergy.component.css',
  standalone: true,
  imports: [
    NgIf,
    CreateAllergyComponent,
    AllergyTableComponent,
    UpdateAllergyComponent,
    DeleteAllergyComponent,
  ]
})
export class AllergyComponent {
  @Output() allergies: Allergy[];
  @Output() displayAllergies: Allergy[];
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
    if (!this.authService.isAuthWithRole(['Admin'])) {
      this.router.navigate(['']);
    }

    this.accessToken = this.authService.getToken() as string;

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

    this.displayAllergies = this.allergies;

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

    this.navigateToAllergy();
  }

  openUpdateModal(allergy: Allergy) {
    this.selectedAllergyToUpdate = allergy;

    this.isUpdateModalOpen = true;
    this.navigateTo('update', { queryParams: { id: JSON.stringify(this.selectedAllergyToUpdate) }});
  }

  async updateAllergy() {
    try {
      await this.service.put(this.accessToken, this.selectedAllergyToUpdate);

      await this.loadInitialData();

      this.message = 'Allergy updated successfully!';
      this.success = true;
    } catch (error) {
      console.error('Error updating allergy:', error);
      this.message = 'Error updating allergy!';
      this.success = false;
    } finally {
      if (this.success) {
        this.closeUpdateModal();
      } else {
        console.error('Error updating allergy:', this.message);
      }
    }
  }

  closeUpdateModal() {
    this.isUpdateModalOpen = false;
    this.selectedAllergyToUpdate = {
      id: '',
      code: '',
      name: '',
      description: ''
    }
    this.navigateToAllergy();
  }

  openDeleteModal(allergy: Allergy) {
    this.selectedAllergyToDelete = allergy;
    this.isDeleteModalOpen = true;

    this.navigateTo('delete', { queryParams: { id: JSON.stringify(this.selectedAllergyToDelete) }});
  }

  async deleteAllergy() {
    try {
      const response = await this.service.delete(this.accessToken, this.selectedAllergyToDelete);

      if (response.status !== 204) {
        this.message = 'Error deleting allergy!';
        this.success = false;
        return;
      }
      await this.loadInitialData();

      this.message = 'Allergy deleted successfully!';
      this.success = true;
    } catch (error) {
      console.error('Error deleting allergy:', error);
      this.message = 'Error deleting allergy!';
      this.success = false;
    } finally {
      if (this.success) {
        this.closeDeleteModal();
      } else {
        console.error('Error deleting allergy:', this.message);
      }
    }
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
    this.selectedAllergyToDelete = {
      id: '',
      code: '',
      name: '',
      description: ''
    };

    this.navigateToAllergy();
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
