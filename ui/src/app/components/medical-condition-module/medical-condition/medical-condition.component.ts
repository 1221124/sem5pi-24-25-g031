import { NgForOf, NgIf } from '@angular/common';
import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MedicalCondition } from '../../../models/medical-condition.model';
import { MedicalConditionService } from '../../../services/medical-condition.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CreateMedicalConditionComponent } from '../create-medical-condition/create-medical-condition.component';
import { UpdateMedicalConditionComponent } from '../update-medical-condition/update-medical-condition.component';
import { DeleteMedicalConditionComponent } from '../delete-medical-condition/delete-medical-condition.component';
import { MedicalConditionTableComponent } from '../medical-condition-table/medical-condition-table.component';

@Component({
  selector: 'app-medical-condition',
  imports: [
    NgIf,
    RouterOutlet,
    NgForOf,
    FormsModule,
    CreateMedicalConditionComponent,
    UpdateMedicalConditionComponent,
    DeleteMedicalConditionComponent,
    MedicalConditionTableComponent
  ],
  templateUrl: './medical-condition.component.html',
  styleUrls: ['./medical-condition.component.css'],
  standalone: true
})
export class MedicalConditionComponent {
    @Output() medicalConditions: MedicalCondition[];
    @Output() selectedMedicalConditionToUpdate!: MedicalCondition;
    @Output() selectedMedicalConditionToDelete!: MedicalCondition;
    @Output() selectedMedicalConditionToCreate!: MedicalCondition;

    constructor(
      private service: MedicalConditionService,
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
        this.router.navigate(['']);
        return;
      }
  
      this.accessToken = this.authService.getToken() as string;
  
      console.log("Access token:", this.accessToken);
  
      if (!this.authService.extractRoleFromAccessToken(this.accessToken)?.toLowerCase().includes('admin')) {
        this.authService.updateMessage(
          'You are not authenticated or are not an admin! Redirecting to login...'
        );
        this.authService.updateIsError(true);
        this.router.navigate(['']);
        return;
      }

      try {
        await this.loadInitialData();
        console.log('All data loaded successfully.');
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    }

    async loadInitialData() {
      const response = await this.service.getMedicalConditions(this.accessToken);

      if (response.status !== 200) {
        this.message = 'Error loading medical conditions!';
        this.success = false;
        return;
      }

      this.medicalConditions = response.body.map((medicalCondition: MedicalCondition) => {
        return {
          id: medicalCondition.id,
          code: medicalCondition.code,
          name: medicalCondition.name,
          description: medicalCondition.description,
          commonSymptoms: medicalCondition.commonSymptoms
        };
      });
    }

    openCreateModal() {
      this.isCreateModalOpen = true;
      this.selectedMedicalConditionToCreate = {
        id: '',
        code: '',
        name: '',
        description: '',
        commonSymptoms: []
      };

      this.navigateTo('create');
    }

    closeCreateModal() {
      this.isCreateModalOpen = false;
      this.selectedMedicalConditionToCreate = {
        id: '',
        code: '',
        name: '',
        description: '',
        commonSymptoms: []
      };

      this.navigateToMedicalCondition();
    }

    openUpdateModal(medicalCondition: MedicalCondition){
     this.selectedMedicalConditionToUpdate = medicalCondition;
     
     this.isUpdateModalOpen = true;
     this.navigateTo('update', { queryParams: { id: JSON.stringify(this.selectedMedicalConditionToUpdate) }})
    }

    async updateMedicalCondition() {
      console.log("TODO: UPDATE -> ", this.selectedMedicalConditionToUpdate);
    }

    closeUpdateModal() {
      this.isUpdateModalOpen = false;
      this.selectedMedicalConditionToUpdate = {
        id: '',
        code: '',
        name: '',
        description: '',
        commonSymptoms: []
      };

      this.navigateToMedicalCondition();
    }

    openDeleteModal(medicalCondition: MedicalCondition){
      this.selectedMedicalConditionToDelete = medicalCondition;
      this.isDeleteModalOpen = true;

      this.navigateTo('delete');
    }

    async deleteMedicalCondition() {
      console.log("TODO: DELETE -> ", this.selectedMedicalConditionToDelete);
    }

    closeDeleteModal() {
      this.isDeleteModalOpen = false;
      this.selectedMedicalConditionToDelete = {
        id: '',
        code: '',
        name: '',
        description: '',
        commonSymptoms: []
      };

      this.navigateToMedicalCondition();
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

    navigateToAdminMenu() {
      this.router.navigate(['admin']).then(r => console.log('Navigated to admin menu:', r));
    }

    navigateToMedicalCondition() {
      this.router.navigate(['admin/medical-conditions']).then(r => console.log('Navigated to medical conditions:', r));
    }
  }
  