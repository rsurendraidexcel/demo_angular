import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DocumentComplianceReporting } from './document-compliance-reporting.component';


const routes: Routes = [
  { path: '', component:  DocumentComplianceReporting}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);