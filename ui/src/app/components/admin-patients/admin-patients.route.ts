import {
  CreateOperationRequestComponent
} from '../operation-requests-main/create-operation-requests/create-operation-requests.component';
import {Route, RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

export const routes: Route[] = [
  { path: 'create', component: CreateOperationRequestComponent },
  { path: 'update', component: CreateOperationRequestComponent },
  { path: 'delete', component: CreateOperationRequestComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OperationRequestsRoute {
}
