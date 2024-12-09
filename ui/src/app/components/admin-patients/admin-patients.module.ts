import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {routes} from './admin-patients.route';
import {AdminPatientsMainComponent} from './admin-patients-main/admin-patients-main.component';
import {AdminPatientsTableComponent} from './admin-patients-table/admin-patients-table.component';
import {AdminPatientsDeleteComponent} from './admin-patients-delete/admin-patients-delete.component';
import {AdminPatientsUpdateComponent} from './admin-patients-update/admin-patients-update.component';
import {AdminPatientsCreateComponent} from './admin-patients-create/admin-patients-create.component';
import {AppComponent} from '../../app.component';
@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    RouterModule.forChild(routes),
    AdminPatientsMainComponent,
    AdminPatientsTableComponent,
    AdminPatientsDeleteComponent,
    AdminPatientsUpdateComponent,
    AdminPatientsCreateComponent
  ],
  exports: [
    AdminPatientsMainComponent,
    AdminPatientsTableComponent,
    AdminPatientsDeleteComponent,
    AdminPatientsUpdateComponent,
    AdminPatientsCreateComponent
  ]
})

export class AdminPatientsModule {}
