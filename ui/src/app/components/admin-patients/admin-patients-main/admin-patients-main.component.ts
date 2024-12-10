import {Component, Output} from '@angular/core';
import {Patient} from '../../../models/patient.model';
import {PatientsService} from '../../../services/admin-patients/admin-patients.service';
import {AuthService} from '../../../services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {CommonModule, NgIf} from '@angular/common';
import {AdminPatientsTableComponent} from '../admin-patients-table/admin-patients-table.component';
import {AdminPatientsDeleteComponent} from '../admin-patients-delete/admin-patients-delete.component';
import {AdminPatientsUpdateComponent} from '../admin-patients-update/admin-patients-update.component';
import {AdminPatientsCreateComponent} from '../admin-patients-create/admin-patients-create.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-patients-main',
  templateUrl: './admin-patients-main.component.html',
  styleUrl: './admin-patients-main.component.css',
  imports: [
    NgIf,
    FormsModule,
    AdminPatientsTableComponent
  ],
  standalone: true
})
export class AdminPatientsMainComponent {
  patients!: Patient[];

  accessToken: string = '';
  message: string = '';
  success: boolean = true;

  constructor(
    private service: PatientsService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.handleAuthenticationError('You are not authenticated or are not a patient-main! Please login...');
      return;
    }

    this.accessToken = this.authService.getToken() as string;

    const role = this.authService.extractRoleFromAccessToken(this.accessToken);

    if (!role?.toLowerCase().includes('admin')) {
      this.handleAuthenticationError('You are not authorized to access this resource! Redirecting to login...');
      return;
    }

    await this.fetchPatients();
  }

  async fetchPatients(){
    try {
      const response = await this.service.getPatients(this.accessToken);
      console.log('Patients fetched successfully', response);
      this.patients = response.body?.patient || [];
    } catch (error) {
      this.handleError('Failed to load patients: ' + error);
    }
  }

  private handleAuthenticationError(message: string) {
    this.authService.updateMessage(message);
    this.authService.updateIsError(true);
    setTimeout(() => {
      this.router.navigate(['']);
    }, 3000);
  }

  private handleError(message: string) {
    this.message = message;
    this.success = false;
    console.error(message);
  }

}
