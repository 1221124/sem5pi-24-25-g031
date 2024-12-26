import {Route, RouterModule} from '@angular/router';
import {AllergyComponent} from './allergy/allergy.component';
import {CreateAllergyComponent} from './create-allergy/create-allergy.component';
import {UpdateAllergyComponent} from './update-allergy/update-allergy.component';
import {DeleteAllergyComponent} from './delete-allergy/delete-allergy.component';
import {NgModule} from '@angular/core';

export const routes: Route[] = [
  { path: '', component: AllergyComponent},
  { path: 'create', component: CreateAllergyComponent},
  { path: 'update', component: UpdateAllergyComponent},
  { path: 'delete', component: DeleteAllergyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AllergyRoute {}
