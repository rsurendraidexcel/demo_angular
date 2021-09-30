import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListChargeCodesComponent } from './list-charge-codes/list-charge-codes.component';
import { ManageChargeCodesComponent } from './manage-charge-codes/manage-charge-codes.component';

const routes: Routes = [
  { path: '', component:  ListChargeCodesComponent},
  { path: ':id', component:  ManageChargeCodesComponent },
  { path: 'add', component:  ManageChargeCodesComponent }
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);