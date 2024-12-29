import { Route, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import {AddSpecializationComponent} from './add-specialization/add-specialization.component';
import {SpecializationsComponent} from './main-specialization/specializations.component';
import {UpdateSpecializationComponent} from './update-specialization/update-specialization.component';

export const routes: Route[] = [
  { path: '', component: SpecializationsComponent },
  { path: 'create', component: AddSpecializationComponent },
  { path: 'update', component: UpdateSpecializationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
