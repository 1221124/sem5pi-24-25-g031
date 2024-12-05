import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientComponent} from './patient-main/patient.component';
import {PatientDetailsComponent} from './patient-details/patient-details.component';
import {AppModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormsModule} from '@angular/forms';
import {DeleteAccountButtonComponent} from './delete-account-button/delete-account-button.component';


@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    CommonModule,
    FormsModule,
    PatientComponent,
    PatientDetailsComponent,
    DeleteAccountButtonComponent,
  ],
  exports: [
    PatientComponent,
    PatientDetailsComponent,
    DeleteAccountButtonComponent
  ]
})
export class PatientModule { }
