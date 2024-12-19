import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { routes } from "./medical-condition.route";

import { MedicalConditionComponent } from "./medical-condition/medical-condition.component";
import { CreateMedicalConditionComponent } from "./create-medical-condition/create-medical-condition.component";
import { DeleteMedicalConditionComponent } from "./delete-medical-condition/delete-medical-condition.component";
import { UpdateMedicalConditionComponent } from "./update-medical-condition/update-medical-condition.component";
import { MedicalConditionTableComponent } from "./medical-condition-table/medical-condition-table.component";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MedicalConditionComponent,
    CreateMedicalConditionComponent,
    UpdateMedicalConditionComponent,
    DeleteMedicalConditionComponent,
    MedicalConditionTableComponent,
  ],
  exports: [
    DeleteMedicalConditionComponent,
    UpdateMedicalConditionComponent,
    MedicalConditionTableComponent,
    MedicalConditionComponent,
    CreateMedicalConditionComponent,
  ],
})
export class MedicalConditionModule {}
