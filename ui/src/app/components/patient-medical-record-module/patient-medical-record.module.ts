import { CommonModule, NgFor, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./patient-medical-record.route";

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgFor,
    NgIf,
    // OperationTypesComponent,
    // OperationTypesFormComponent,
    // OperationTypesListComponent,
    // ToggleOperationTypeStatusComponent
  ],
  exports: [
    // OperationTypesComponent,
    // OperationTypesFormComponent,
    // OperationTypesListComponent,
    // ToggleOperationTypeStatusComponent
  ]
})
export class PatientMedicalRecordModule {}