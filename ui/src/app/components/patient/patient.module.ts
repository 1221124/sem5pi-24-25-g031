import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientComponent} from './patient-main/patient.component';
import {PatientDetailsComponent} from './patient-details/patient-details.component';
import {AppModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    CommonModule,
    FormsModule,
    PatientComponent,
    PatientDetailsComponent
  ],
  exports: [
    PatientComponent,
    PatientDetailsComponent
  ]
})
export class PatientModule { }
