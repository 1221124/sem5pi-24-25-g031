import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

export const routes: Route[] = [
  // { path: '', component: OperationTypesComponent },
  // { path: 'create', component: OperationTypesFormComponent},
  // { path: 'update', component: OperationTypesFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientMedicalRecordRoute {}