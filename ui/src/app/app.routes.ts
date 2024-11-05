import { Route, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

export const routes: Route[] = [
  { path: '', component: AppComponent },
  { path: 'callback', component: AuthCallbackComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }