import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';

const routes: Routes = [
  { path: '', component:  TemplatesComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
