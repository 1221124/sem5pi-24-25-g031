import { NgModule } from "@angular/core";
import { Route, RouterModule } from "@angular/router";
import { CreateMedicalConditionComponent } from "./create-medical-condition/create-medical-condition.component";
import { UpdateMedicalConditionComponent } from "./update-medical-condition/update-medical-condition.component";
import { DeleteOperationRequestsComponent } from "../operation-requests-main/delete-operation-requests/delete-operation-requests.component";
import { MedicalConditionComponent } from "./medical-condition/medical-condition.component";

export const routes: Route[] = [
  {path: '', component: MedicalConditionComponent},
  {path: 'create', component: CreateMedicalConditionComponent},
  {path: 'update', component: UpdateMedicalConditionComponent},
  {path: 'delete', component: DeleteOperationRequestsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRequestsRoute {
}
