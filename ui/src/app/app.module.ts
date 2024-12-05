import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './components/home/home.component';
import { OperationRequestsComponent } from './components/operation-requests/operation-requests.component';
import { StaffsComponent } from './components/staffs-main/staffs/staffs.component';
import { OperationTypesComponent } from './components/operation-types/operation-types.component';
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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
    declarations: [
        AdminMenuComponent,
        DoctorMenuComponent,
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
    BrowserAnimationsModule,
    AdminUsersComponent,
    AppComponent,
    AuthCallbackComponent,
    AppointmentsComponent,
    OperationRequestsComponent,
    OperationTypesComponent,
    StaffsComponent,
    PrologComponent,
    AppointmentsComponent,
    PatientModule,
    StaffModule
  ],
    providers: [],
  exports: [
  ],
    bootstrap: []
})
export class AppModule { }
