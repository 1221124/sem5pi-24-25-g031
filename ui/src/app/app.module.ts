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


@NgModule({
  declarations: [
    AdminMenuComponent,
    AppComponent,
    AuthCallbackComponent,
    HomeComponent,
    OperationRequestsComponent,
    OperationTypesComponent,
    StaffsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
