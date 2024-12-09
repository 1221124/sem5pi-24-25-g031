import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './components/home/home.component';
import { StaffsComponent } from './components/staffs-main/staffs/staffs.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DoctorMenuComponent } from './components/doctor-menu/doctor-menu.component';
import { NurseMenuComponent } from './components/nurse-menu/nurse-menu.component';
import { TechnicianMenuComponent } from './components/technician-menu/technician-menu.component';
import { PrologComponent } from './components/prolog/prolog.component';
import { AppointmentsComponent } from './components/appointments/appointments.component';
import {PatientModule} from './components/patient/patient.module';
import { StaffModule } from './components/staffs-main/staffs.module';
import { VerifyPatientSensitiveInfoComponent } from './components/verify-patient-sensitive-info/verify-patient-sensitive-info.component';
import { VerifyStaffSensitiveInfoComponent } from './components/verify-staff-sensitive-info/verify-staff-sensitive-info.component';
import { VerifyRemovePatientComponent } from './components/verify-remove-patient/verify-remove-patient.component';

import { OperationRequestsModule } from './components/operation-requests-main/operation-requests.module';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { OperationTypesComponent } from './components/operation-types-module/operation-types/operation-types.component';
import { OperationTypesModule } from './components/operation-types-module/operation-types.module';

@NgModule({
  declarations: [
    AdminMenuComponent,
    HomeComponent,
    NurseMenuComponent,
    TechnicianMenuComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    FormsModule,
    AdminUsersComponent,
    AppComponent,
    AppointmentsComponent,
    AuthCallbackComponent,
    OperationTypesModule,
    StaffsComponent,
    OperationRequestsModule,
    PrologComponent,
    DoctorMenuComponent,
    AppointmentsComponent,
    PatientModule,
    StaffModule,
    VerifyEmailComponent,
    VerifyPatientSensitiveInfoComponent,
    VerifyStaffSensitiveInfoComponent,
    VerifyRemovePatientComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }
