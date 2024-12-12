import { CommonModule, NgFor, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./appointments.route";
import { AppointmentsComponent } from './appointments/appointments.component';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgFor,
    NgIf,
    AppointmentsComponent,
    // AppointmentsFormComponent,
    // AppointmentsListComponent
  ],
  exports: [
    AppointmentsComponent,
    // AppointmentsFormComponent,
    // AppointmentsListComponent
  ],
  declarations: [
    AppointmentsComponent
  ]
})
export class OperationTypesModule {}