import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherGeneralCodesComponent } from './other-general-codes.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  {
    path: '', component: OtherGeneralCodesComponent, children: [
      { path: 'ineligibility-reasons', loadChildren: "./ineligibility-reasons/ineligibility-reasons.module#IneligibilityReasonsModule" },
      { path: 'file-classifications', loadChildren: "./file-classifications/file-classifications.module#FileClassificationsModule" },
      { path: 'charge-codes', loadChildren: "./charge-codes/charge-codes.module#ChargeCodesModule" },
      { path: 'interest-rate-codes', loadChildren: "./interest-rate-codes/interest-rate-codes.module#InterestRateCodesModule" },
      { path: 'exceptions', loadChildren: "./exceptions/exceptions.module#ExceptionsModule" },
      { path: 'gl-setup', loadChildren: "./gl-setup/gl-setup.module#GlSetupModule" },
      { path: 'loan-type', loadChildren: "./loan-type/loan-type.module#LoanTypeModule" },
      { path: 'cash-control', loadChildren: "./cash-control/cash-control.module#CashControlModule" }
    ]
  }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);