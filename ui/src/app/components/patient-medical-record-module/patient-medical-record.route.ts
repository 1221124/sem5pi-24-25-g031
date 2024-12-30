import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { PatientMedicalRecordComponent } from './patient-medical-record/patient-medical-record.component';
import { MedicalConditionEntryFormComponent } from './medical-condition-entry-form/medical-condition-entry-form.component';
import {AllergyEntryFormComponent} from './allergy-entry-form/allergy-entry-form.component';
import { DownloadHistoryFormComponent } from './download-history-form/download-history-form.component';

export const routes: Route[] = [
  { path: '', component: PatientMedicalRecordComponent },
  { path: 'medical-condition', component: MedicalConditionEntryFormComponent },
  { path: 'allergy', component: AllergyEntryFormComponent },
  { path: 'download', component: DownloadHistoryFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PatientMedicalRecordRoute {}
