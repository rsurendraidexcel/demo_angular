import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WebHooksComponent } from './web-hooks.component';
const routes: Routes = [
  {
    path: '', component: WebHooksComponent,
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
