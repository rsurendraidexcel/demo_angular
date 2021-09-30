import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExceptionReportingComponent } from './exception-reporting.component';

const routes: Routes = [
  { path: '', component:  ExceptionReportingComponent}, 
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);