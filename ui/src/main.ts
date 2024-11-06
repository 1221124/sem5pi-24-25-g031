import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { appConfig } from './app/app.config';
import { provideHttpClient } from '@angular/common/http';
import { OperationRequestsComponent } from './app/components/operation-requests/operation-requests.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    appConfig.providers
  ]
})
.catch((err) => {
  console.error(err);
});

bootstrapApplication(OperationRequestsComponent)
.catch((err) => {
  console.error(err);
});