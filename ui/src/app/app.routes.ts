import { Route, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { StaffsComponent } from './components/staffs-main/staffs/staffs.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { DoctorMenuComponent } from './components/doctor-menu/doctor-menu.component';
import { PrologComponent } from './components/prolog/prolog.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import { OperationRequestsComponent } from './components/operation-requests-main/operation-requests/operation-requests.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { VerifyPatientSensitiveInfoComponent } from './components/verify-patient-sensitive-info/verify-patient-sensitive-info.component';
import { VerifyStaffSensitiveInfoComponent } from './components/verify-staff-sensitive-info/verify-staff-sensitive-info.component';
import { VerifyRemovePatientComponent } from './components/verify-remove-patient/verify-remove-patient.component';
import { PatientComponent } from './components/patient/patient-main/patient.component';
import { NurseMenuComponent } from './components/nurse-menu/nurse-menu.component';
import { TechnicianMenuComponent } from './components/technician-menu/technician-menu.component';
import { AdminPatientsMainComponent } from './components/admin-patients/admin-patients-main/admin-patients-main.component';
import { ListStaffsComponent } from './components/staffs-main/list-staffs/list-staffs.component';
import { PaginationStaffsComponent } from './components/staffs-main/pagination-staffs/pagination-staffs.component';
import {OperationTypesComponent} from './components/operation-types-module/operation-types/operation-types.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: AuthCallbackComponent },
  {
    path: 'admin/staffs',
    component: StaffsComponent,
    children: [
      {
        path: 'create',
        loadChildren: () =>
          import('./components/staffs-main/staffs.module')
            .then((m) => m.StaffModule),
      },
      {
        path: 'update',
        loadChildren: () =>
          import('./components/staffs-main/staffs.module')
            .then((m) => m.StaffModule),
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      }
    ]
  },
  { path: 'doctor/operationRequests', component: OperationRequestsComponent },
  { path: 'admin/appointments', component: AppointmentsComponent },
  { path: 'admin/operationTypes', component: OperationTypesComponent },
  { path: 'admin/patients', component: AdminPatientsMainComponent },
  { path: 'admin/patients', component: AdminPatientsMainComponent },
  { path: 'admin/users', component: AdminUsersComponent },
  { path: 'admin/prolog', component: PrologComponent },
  {
    path: 'admin/operationTypes',
    component: OperationTypesComponent,
    children: [
      {
        path: 'create',
        loadChildren: () =>
          import('./components/operation-types-module/operation-types.module')
            .then((m) => m.OperationTypesModule),
      },
      {
        path: 'update',
        loadChildren: () =>
          import('./components/operation-types-module/operation-types.module')
            .then((m) => m.OperationTypesModule),
      },
    ],
  },
  {
    path: 'doctor',
    component: DoctorMenuComponent,
    children: [
      {
        path: 'operation-requests',
        component: OperationRequestsComponent,
        loadChildren: () =>
          import('./components/operation-requests-main/operation-requests.module')
          .then((m) => m.OperationRequestsModule)
      }
    ]},
  { path: 'patient', component: PatientComponent },
  { path: 'nurse', component: NurseMenuComponent },
  { path: 'technician', component: TechnicianMenuComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'verify-patient-sensitive-info', component: VerifyPatientSensitiveInfoComponent },
  { path: 'verify-staff-sensitive-info', component: VerifyStaffSensitiveInfoComponent },
  { path: 'verify-remove-patient', component: VerifyRemovePatientComponent },
  { path: 'admin', component: AdminMenuComponent },
  { path: 'doctor', component: DoctorMenuComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'nurse', component: NurseMenuComponent },
  { path: 'technician', component: TechnicianMenuComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
