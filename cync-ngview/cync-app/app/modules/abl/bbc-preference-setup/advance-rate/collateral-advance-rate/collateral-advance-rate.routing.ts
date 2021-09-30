import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollateralAdvanceRateComponent } from './collateral-advance-rate.component';
import { ListCollateralAdvanceRateComponent } from './list-collateral-advance-rate/list-collateral-advance-rate.component';
import { ManageCollateralAdvanceDivisionComponent } from './manage-collateral-advance-division/manage-collateral-advance-division.component';
import { ManageCollateralAdvanceRateComponent } from './manage-collateral-advance-rate/manage-collateral-advance-rate.component';

const routes: Routes = [
  { path: '', component:  ListCollateralAdvanceRateComponent},
  { path: ':id', component:  ManageCollateralAdvanceDivisionComponent },
  { path: 'add', component:  ManageCollateralAdvanceDivisionComponent },
  { path: 'advance-rate/add', component:  ManageCollateralAdvanceRateComponent }
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);