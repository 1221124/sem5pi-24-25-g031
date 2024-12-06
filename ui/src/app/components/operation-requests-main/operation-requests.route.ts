import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';
import {CreateOperationRequestComponent} from './create-operation-requests/create-operation-requests.component';
import {UpdateOperationRequestsComponent} from './update-operation-requests/update-operation-requests.component';
import {DeleteOperationRequestsComponent} from './delete-operation-requests/delete-operation-requests.component';

export const routes: Route[] = [
  {path: 'create', component: CreateOperationRequestComponent},
  {path: 'update', component: UpdateOperationRequestsComponent},
  {path: 'delete', component: DeleteOperationRequestsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperationRequestsRoute {
}
