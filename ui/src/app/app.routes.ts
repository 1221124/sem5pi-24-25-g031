import { Route, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { StaffsComponent } from './components/staffs/staffs.component';
import { OperationRequestsComponent } from './components/operation-requests/operation-requests.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: AuthCallbackComponent },
  { path: 'staffs', component: StaffsComponent },
  { path: 'operationRequests', component: OperationRequestsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }