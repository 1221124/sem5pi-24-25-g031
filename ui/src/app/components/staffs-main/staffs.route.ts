import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {CreateStaffsComponent} from './create-staffs/create-staffs.component';
import {UpdateStaffsComponent} from './update-staffs/update-staffs.component';
import {OperationTypesComponent} from '../operation-types-module/operation-types/operation-types.component';
import {StaffsComponent} from './staffs/staffs.component';

export const routes: Route[] = [
  { path: '', component: StaffsComponent },
  { path: 'create', component: CreateStaffsComponent },
  { path: 'update', component: UpdateStaffsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
