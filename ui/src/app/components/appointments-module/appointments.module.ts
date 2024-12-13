import { CommonModule, NgFor, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./appointments.route";
import { AppointmentsComponent } from './appointments/appointments.component';
import { AppointmentsFormComponent } from './appointments-form/appointments-form.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgFor,
    NgIf,
    AppointmentsComponent,
    AppointmentsFormComponent,
    // AppointmentsListComponent
  ],
  exports: [
    AppointmentsComponent,
    AppointmentsFormComponent,
    // AppointmentsListComponent
  ],
  declarations: [
    AppointmentsListComponent
  ]
})
export class OperationTypesModule {}