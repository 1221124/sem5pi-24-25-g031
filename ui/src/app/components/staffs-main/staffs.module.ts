import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import {StaffsComponent} from "./staffs/staffs.component";
import {ListStaffsComponent} from "./list-staffs/list-staffs.component";
import {SlotComponent} from '../slot/slot.component';
import {CreateStaffsComponent} from './create-staffs/create-staffs.component';
import {UpdateStaffsComponent} from './update-staffs/update-staffs.component';
import { RouterModule } from '@angular/router';
import { routes } from './staffs.route';

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgFor,
    NgIf,
    StaffsComponent,
    ListStaffsComponent,
    CreateStaffsComponent,
    UpdateStaffsComponent,
    SlotComponent
  ],
  exports: [
    StaffsComponent,
    ListStaffsComponent,
    CreateStaffsComponent,
    UpdateStaffsComponent,
    SlotComponent
  ]
})
export class StaffModule { }