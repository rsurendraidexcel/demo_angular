import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IneligibleAdvancesComponent } from './ineligible-advances.component';


const routes: Routes = [
  { path: '', component: IneligibleAdvancesComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);