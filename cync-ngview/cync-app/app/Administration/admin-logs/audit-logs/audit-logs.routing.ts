import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuditLogsComponent } from './audit-logs.component';

const routes: Routes = [
  { path: '', component:  AuditLogsComponent},
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
