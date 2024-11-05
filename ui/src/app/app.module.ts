import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { OperationTypesComponent } from './components/operationTypes/operationTypes.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OperationTypesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }