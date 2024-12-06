import { NgModule } from '@angular/core';
import { DeleteOperationRequestsComponent } from './delete-operation-requests/delete-operation-requests.component';
import { UpdateOperationRequestsComponent } from './update-operation-requests/update-operation-requests.component';
import { CreateOperationRequestComponent } from './create-operation-requests/create-operation-requests.component';
import { OperationRequestsTableComponent } from './operation-requests-table/operation-requests-table.component';
import { OperationRequestsComponent } from './operation-requests/operation-requests.component';
import { AppComponent } from '../../app.component';
import { routes } from './operation-requests.route';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    RouterModule.forChild(routes),
    OperationRequestsComponent,
    OperationRequestsTableComponent,
    UpdateOperationRequestsComponent,
    DeleteOperationRequestsComponent,
    CreateOperationRequestComponent,
  ],
  exports: [
    OperationRequestsComponent,
    OperationRequestsTableComponent,
    UpdateOperationRequestsComponent,
    DeleteOperationRequestsComponent,
    CreateOperationRequestComponent,
  ],
})
export class OperationRequestsModule {}
