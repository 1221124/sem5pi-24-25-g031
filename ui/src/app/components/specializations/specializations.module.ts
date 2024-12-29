import { NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';
import {SpecializationsComponent} from "./main-specialization/specializations.component";
import {routes} from "../../app.routes";
import {AddSpecializationComponent} from "./add-specialization/add-specialization.component";
import {ListSpecializationComponent} from "./list-specialization/list-specialization.component";
import {SpecializationsService} from "../../services/specializations/specializations.service";
import { UpdateSpecializationComponent } from './update-specialization/update-specialization.component';

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        FormsModule,
        NgFor,
        NgIf,
        SpecializationsComponent,
        AddSpecializationComponent,
        ListSpecializationComponent,
        UpdateSpecializationComponent
    ],
    exports: [
        SpecializationsComponent,
        UpdateSpecializationComponent
    ],
})
export class SpecializationsModule { }
