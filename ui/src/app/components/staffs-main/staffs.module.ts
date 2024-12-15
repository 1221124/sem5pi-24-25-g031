import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponent} from '../../app.component';
import {FormsModule} from '@angular/forms';
import {StaffsComponent} from "./staffs/staffs.component";
import {ListStaffsComponent} from "./list-staffs/list-staffs.component";
import {SlotComponent} from '../slot/slot.component';
import {CreateStaffsComponent} from './create-staffs/create-staffs.component';
import {UpdateStaffsComponent} from './update-staffs/update-staffs.component';
import {SucessModalStaffsComponent} from './sucess-modal-staffs/sucess-modal-staffs.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    CommonModule,
    FormsModule,
    StaffsComponent,
    ListStaffsComponent,
    CreateStaffsComponent,
    UpdateStaffsComponent,
    SucessModalStaffsComponent,
    SlotComponent
  ],
  exports: [
    StaffsComponent,
    ListStaffsComponent,
    CreateStaffsComponent,
    UpdateStaffsComponent,
    SucessModalStaffsComponent,
    SlotComponent
  ]
})
export class StaffModule { }
