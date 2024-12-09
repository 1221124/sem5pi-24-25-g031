import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { OperationTypesComponent } from './operation-types/operation-types.component';

export const routes: Route[] = [
  { path: '', component: OperationTypesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OperationTypesRoute {}