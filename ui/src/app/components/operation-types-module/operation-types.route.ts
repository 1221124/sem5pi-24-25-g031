import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { OperationTypesComponent } from './operation-types/operation-types.component';
import { OperationTypesFormComponent } from './operation-types-form/operation-types-form.component';

export const routes: Route[] = [
  { path: '', component: OperationTypesComponent },
  { path: 'create', component: OperationTypesFormComponent},
  { path: 'update', component: OperationTypesFormComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationTypesRoute {}