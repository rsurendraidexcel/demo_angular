import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LenderDetailsComponent } from './lender-details.component';
import { AuthGuard } from '../../../app-common/auth/auth';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  { path: '', component: LenderDetailsComponent, children : [
  { path: 'basic-details', loadChildren: "../../../app/Administration/lender-details/basic-details/basic-details.module#BasicDetailsModule"},
  { path: 'bank-account-details', loadChildren: "../../../app/Administration/lender-details/bank-account-details-new/bank-account-details-new.module#BankAccountDetailsNewModule", canActivate: [AuthGuard]},
  { path: 'ip-address-setup', loadChildren: "./ip-address-setup/ip-address-setup.module#IpAddressSetupModule"}
    ] 
  }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
