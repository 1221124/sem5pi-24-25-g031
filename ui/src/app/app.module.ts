import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { HomeComponent } from './components/home/home.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
