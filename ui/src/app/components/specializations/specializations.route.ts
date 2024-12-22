import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {AddSpecializationComponent} from './add-specialization/add-specialization.component';
import {SpecializationsComponent} from './main-specialization/specializations.component';

export const routes: Route[] = [
  { path: '', component: SpecializationsComponent },
  { path: 'create', component: AddSpecializationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
