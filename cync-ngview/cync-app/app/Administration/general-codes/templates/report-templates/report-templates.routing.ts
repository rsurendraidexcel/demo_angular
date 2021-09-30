import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportTemplatesComponent } from './report-templates.component';

const routes: Routes = [
  { path: '', component:  ReportTemplatesComponent}

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
