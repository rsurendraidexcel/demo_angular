import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanMaintenanceComponent } from './loan-maintenance.component';

const routes: Routes = [
  {
    path: '', 
    redirectTo: 'loan-activity', 
    pathMatch: 'full'
  },
  { path: 'loan-activity', loadChildren: './loan-activity/loan-activity.module#LoanActivityModule' },
  { path:  'participation-loans', loadChildren:'./participation-loans/participation-loans.module#ParticipationLoansModule'}
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
