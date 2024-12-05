import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PatientComponent} from './patient-main/patient.component';
import {PatientDetailsComponent} from './patient-details/patient-details.component';
import {AppModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormsModule} from '@angular/forms';
import {DeleteAccountButtonComponent} from './delete-account-button/delete-account-button.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

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
