import { CommonModule, NgFor, NgIf } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "./patient-medical-record.route";
import { PatientMedicalRecordComponent } from "./patient-medical-record/patient-medical-record.component";
import { MedicalConditionEntryFormComponent } from "./medical-condition-entry-form/medical-condition-entry-form.component";
@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    NgFor,
    NgIf,
    PatientMedicalRecordComponent,
    MedicalConditionEntryFormComponent,
  ],
  exports: [
    PatientMedicalRecordComponent,
    MedicalConditionEntryFormComponent
  ]
})
export class PatientMedicalRecordModule {}