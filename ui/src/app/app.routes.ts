import { Route, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { StaffsComponent } from './components/staffs/staffs.component';
import { OperationRequestsComponent } from './components/operation-requests/operation-requests.component';
import { PatientComponent } from './components/patient/patient.component';
import { AdminPatientsComponent } from './components/admin-patients/admin-patients.component';
import { OperationTypesComponent } from './components/operation-types/operation-types.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { DoctorMenuComponent } from './components/doctor-menu/doctor-menu.component';
import { NurseMenuComponent } from './components/nurse-menu/nurse-menu.component';
import { TechnicianMenuComponent } from './components/technician-menu/technician-menu.component';
import {PrologComponent} from './components/prolog/prolog.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: AuthCallbackComponent },
  { path: 'admin/staffs', component: StaffsComponent },
  { path: 'doctor/operationRequests', component: OperationRequestsComponent },
  { path: 'admin/operationTypes', component: OperationTypesComponent },
  { path: 'admin/patients', component: AdminPatientsComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/prolog', component: PrologComponent },
  { path: 'admin', component: AdminMenuComponent },
  { path: 'doctor', component: DoctorMenuComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'nurse', component: NurseMenuComponent },
  { path: 'technician', component: TechnicianMenuComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
