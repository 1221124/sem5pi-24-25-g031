import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import { routes } from './allergy.route';

import {AllergyComponent} from './allergy/allergy.component';
import {CreateAllergyComponent} from './create-allergy/create-allergy.component';
import {UpdateAllergyComponent} from './update-allergy/update-allergy.component';
import {DeleteAllergyComponent} from './delete-allergy/delete-allergy.component';
import {AllergyTableComponent} from './allergy-table/allergy-table.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AllergyComponent,
    CreateAllergyComponent,
    UpdateAllergyComponent,
    DeleteAllergyComponent,
    AllergyTableComponent
  ],
  exports: [
    DeleteAllergyComponent,
    UpdateAllergyComponent,
    AllergyTableComponent,
    AllergyComponent,
    CreateAllergyComponent
  ],
})

export class AllergyModule {}
