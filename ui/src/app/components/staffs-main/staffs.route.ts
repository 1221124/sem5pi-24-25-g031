import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {CreateStaffsComponent} from './create-staffs/create-staffs.component';
import {UpdateStaffsComponent} from './update-staffs/update-staffs.component';

export const routes: Route[] = [
  { path: 'create', component: CreateStaffsComponent },
  { path: 'update', component: UpdateStaffsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
