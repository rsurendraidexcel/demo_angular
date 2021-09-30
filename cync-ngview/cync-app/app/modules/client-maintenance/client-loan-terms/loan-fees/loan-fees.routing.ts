import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanFeesComponent } from './loan-fees.component';


const routes: Routes = [
  { path: '', component: LoanFeesComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);