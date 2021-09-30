import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientLoanComponent } from './client-loan-terms.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  { path: '', component:  ClientLoanComponent,children : [
    { path: 'guarantors', loadChildren: "./guarantors/guarantors.module#GuarantorsModule",canActivate:[CheckClientSelection]},
    { path: 'third-party-guarantors', loadChildren: "./third-party-guarantors/third-party-guarantors.module#ThirdPartyGuarantorsModule",canActivate:[CheckClientSelection]},
    { path: 'insurance-policies', loadChildren: "./insurance-policies/insurance-policies.module#InsurancePoliciesModule",canActivate:[CheckClientSelection]},
    { path: 'borrower-guarantors', loadChildren: "./borrower-guarantors/borrower-guarantors.module#BorrowerGuarantorsModule",canActivate:[CheckClientSelection]},
    { path: 'personal-guarantors', loadChildren: "./personal-guarantors/personal-guarantors.module#PersonalGuarantorsModule",canActivate:[CheckClientSelection]},
    { path: 'loan-fees', loadChildren: "./loan-fees/loan-fees.module#LoanFeesModule",canActivate:[CheckClientSelection]},
    { path: 'ineligible-advances', loadChildren: "./ineligible-advances/ineligible-advances.module#IneligibleAdvancesModule",canActivate:[CheckClientSelection]},

    ]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);