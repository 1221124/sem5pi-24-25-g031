import { CommonModule, NgFor, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OperationTypesFormComponent } from "./operation-types-form/operation-types-form.component";
import { OperationTypesListComponent } from "./operation-types-list/operation-types-list.component";
import { OperationTypesComponent } from "./operation-types/operation-types.component";
import { ToggleOperationTypeStatusComponent } from "./toggle-operation-type-status/toggle-operation-type-status.component";
import { routes } from "./operation-types.route";

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgFor,
    NgIf,
    OperationTypesComponent,
    OperationTypesFormComponent,
    OperationTypesListComponent,
    ToggleOperationTypeStatusComponent
  ],
  exports: [
    OperationTypesComponent,
    OperationTypesFormComponent,
    OperationTypesListComponent,
    ToggleOperationTypeStatusComponent
  ]
})
export class OperationTypesModule {}