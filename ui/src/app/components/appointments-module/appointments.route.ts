import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AppointmentsComponent } from '../appointments/appointments.component';

export const routes: Route[] = [
  { path: '', component: AppointmentsComponent },
  // { path: 'create', component: AppointmentsFormComponent},
  // { path: 'update', component: AppointmentsFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationTypesRoute {}