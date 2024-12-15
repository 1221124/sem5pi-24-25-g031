import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AppComponent} from '../../app.component';
import {FormsModule} from '@angular/forms';
import {StaffsComponent} from "./staffs/staffs.component";
import {ListStaffsComponent} from "./list-staffs/list-staffs.component";
import {PaginationStaffsComponent} from './pagination-staffs/pagination-staffs.component';
import {SlotComponent} from '../slot/slot.component';
import {CreateStaffsComponent} from './create-staffs/create-staffs.component';
import {UpdateStaffsComponent} from './update-staffs/update-staffs.component';

@NgModule({
  declarations: [
  ],
  imports: [
    AppComponent,
    CommonModule,
    FormsModule,
    StaffsComponent,
    ListStaffsComponent,
    PaginationStaffsComponent,
    CreateStaffsComponent,
    UpdateStaffsComponent,
    SlotComponent
  ],
  exports: [
    StaffsComponent,
    ListStaffsComponent,
    PaginationStaffsComponent,
    CreateStaffsComponent,
    UpdateStaffsComponent,
    SlotComponent
  ]
})
export class StaffModule { }
