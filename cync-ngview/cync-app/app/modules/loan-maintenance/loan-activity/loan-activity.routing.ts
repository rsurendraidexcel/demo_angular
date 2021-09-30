import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanEnquiryComponent } from './loan-enquiry/loan-enquiry.component';
import { LoanSummaryComponent } from './loan-summary/loan-summary.component';
import { BulkExportComponent } from './loan-enquiry/bulk-export/bulk-export.component';
import { LoanSetupComponent } from './loan-setup/loan-setup/loan-setup.component';
import { ProcessOneTimeManualChargesComponent } from './process-one-time-manual-charges/process-one-time-manual-charges.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';
const routes: Routes = [
    { path: '', redirectTo: 'loan-enquiry', pathMatch: 'full' },
    { path: 'loan-enquiry', component: LoanEnquiryComponent },
    { path: 'loan-summary', component: LoanSummaryComponent },
    { path: 'bulk-export', component: BulkExportComponent },
    { path: 'loan-setup', component: LoanSetupComponent , canActivate:[CheckClientSelection]},
    { path: 'onetime-manual-process', component: ProcessOneTimeManualChargesComponent,  canActivate: [CheckClientSelection] }
    
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
