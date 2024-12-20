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
      const response = await this.service.get(this.accessToken);

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
      console.log('Opening create modal...');
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

    async createMedicalCondition(){
      console.log("TODO: CREATE -> ", this.selectedMedicalConditionToCreate);
      
      try {
        const response = await this.service.post(this.accessToken, this.selectedMedicalConditionToCreate);

        console.log('Response:', response);

        if (response.status !== 201 || !response.body) {
          this.message = 'Error creating medical condition!';
          this.success = false;
          console.log('Error creating medical condition:', response);
          return;
        }

        this.medicalConditions = [{
          id: response.body.id,
          code: response.body.code,
          name: response.body.name,
          description: response.body.description,
          commonSymptoms: response.body.commonSymptoms
        }];

        this.message = 'Medical condition created successfully!';
        this.success = true;
      }
      catch (error) {
        this.message = 'Error creating medical condition!';
        this.success = false;
        console.error('Error creating medical condition:', error);
      }finally{
        if(this.success){
          await this.loadInitialData();
          this.closeCreateModal();
        }
        else console.error('Error creating medical condition:', this.message);
      }
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
      try{
        console.log("UPDATE -> ", this.selectedMedicalConditionToUpdate);
      
        await this.service.put(this.accessToken, this.selectedMedicalConditionToUpdate);
      
        await this.loadInitialData();

        this.message = 'Medical condition updated successfully!';
        this.success = true;
      } catch (error) {
        this.message = 'Error updating medical condition!';
        this.success = false;
        console.error('Error updating medical condition:', error);
      } finally {
        if(this.success){
          this.closeUpdateModal();
        }
        else console.error('Error updating medical condition:', this.message);
      }
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
  