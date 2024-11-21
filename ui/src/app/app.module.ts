import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { routes } from './app.routes';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { HomeComponent } from './components/home/home.component';
import { OperationRequestsComponent } from './components/operation-requests/operation-requests.component';
import { StaffsComponent } from './components/staffs/staffs.component';
import { OperationTypesComponent } from './components/operation-types/operation-types.component';
import { AdminMenuComponent } from './components/admin-menu/admin-menu.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DoctorMenuComponent } from './components/doctor-menu/doctor-menu.component';
import { NurseMenuComponent } from './components/nurse-menu/nurse-menu.component';
import { TechnicianMenuComponent } from './components/technician-menu/technician-menu.component';
import { Visualization3DComponent } from './components/visualization3-d/visualization3-d.component';


@NgModule({
  declarations: [
    AdminMenuComponent,
    AdminUsersComponent,
    AppComponent,
    AuthCallbackComponent,
    DoctorMenuComponent,
    HomeComponent,
    NurseMenuComponent,
    OperationRequestsComponent,
    OperationTypesComponent,
    StaffsComponent,
    TechnicianMenuComponent,
    Visualization3DComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
