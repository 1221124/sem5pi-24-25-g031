import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PatientMedicalRecordComponent } from './patient-medical-record/patient-medical-record.component';
import { MedicalConditionEntryFormComponent } from './medical-condition-entry-form/medical-condition-entry-form.component';

export const routes: Route[] = [
  { path: '', component: PatientMedicalRecordComponent },
  { path: 'medical-condition', component: MedicalConditionEntryFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientMedicalRecordRoute {}