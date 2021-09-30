import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralReservesComponent } from './collateral-reserves.component';

const routes: Routes = [
  { path: '', component:  CollateralReservesComponent}
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);