import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppModule} from '../../app.module';
import {AppComponent} from '../../app.component';
import {FormsModule} from '@angular/forms';
import {StaffsComponent} from "./staffs/staffs.component";
import {ListStaffsComponent} from "./list-staffs/list-staffs.component";

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    CommonModule,
    FormsModule,
    StaffsComponent,
    ListStaffsComponent
  ],
  exports: [
    StaffsComponent,
    ListStaffsComponent
  ]
})
export class StaffModule { }
