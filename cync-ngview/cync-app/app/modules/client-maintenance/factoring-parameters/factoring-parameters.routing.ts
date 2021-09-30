import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';
import { FeeSetupFormComponent } from './factoring-fee-setup/fee-setup-form/fee-setup-form.component';
import { FactoringInterestSetupComponent } from './factoring-interest-setup/factoring-interest-setup.component';

const routes: Routes = [
  { path: 'fee-setup', component: FeeSetupFormComponent },
  { path: 'factoring-interest-setup', component : FactoringInterestSetupComponent, canActivate: [CheckClientSelection] }
];

export const Routing: ModuleWithProviders = RouterModule.forChild(routes);