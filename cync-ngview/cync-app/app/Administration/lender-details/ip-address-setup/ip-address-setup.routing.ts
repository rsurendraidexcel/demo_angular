import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIpAddressSetupComponent } from './list-ip-address-setup/list-ip-address-setup.component';
import { ManageIpAddressSetupComponent } from './manage-ip-address-setup/manage-ip-address-setup.component';

const routes: Routes = [
  { path: '', component:  ListIpAddressSetupComponent },
  { path: ':id', component:  ManageIpAddressSetupComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
