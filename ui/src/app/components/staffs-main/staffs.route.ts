import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { StaffsMainComponent } from './staffs/staffs.component';

export const routes: Route[] = [
  { path: '', component: StaffsMainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
