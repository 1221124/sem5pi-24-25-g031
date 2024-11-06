import { Route, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'callback', component: AuthCallbackComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }