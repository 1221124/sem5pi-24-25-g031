import { Route, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';

export const routes: Route[] = [
  { path: '', component: HomeComponent },
  { path: 'api/Users/callback', component: AuthCallbackComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }