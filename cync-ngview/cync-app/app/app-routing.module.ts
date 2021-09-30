import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  { path: 'currency', loadChildren: '../app/Administration/currency/currency.module#CurrencyModule' },
  { path: 'generalCodes', loadChildren: '../app/Administration/general-codes/general-codes.module#GeneralCodesModule' },
  { path: 'lenderDetails', loadChildren: '../app/Administration/lender-details/lender-details.module#LenderDetailsModule' },
  { path: 'adminLogs', loadChildren: '../app/Administration/admin-logs/admin-logs.module#AdminLogsModule' },
  { path: 'userMaintenance', loadChildren: '../app/Administration/user-maintenance/user-maintenance.module#UserMaintenanceModule' },
  { path: 'notificationCenter', loadChildren: '../app/Administration/notification-center/notification-center.module#NotificationCenterModule' },
  { path: 'bbc-preference-setup', loadChildren: './modules/abl/bbc-preference-setup/bbc-preference-setup.module#BbcPreferenceSetupModule' },
  { path: 'bbc-review-manual-input', loadChildren: './modules/abl/bbc-review-manual-input/bbc-review-manual-input.module#BbcReviewManualInputModule', canActivate: [CheckClientSelection] },
  { path: 'uploads', loadChildren: './modules/abl/uploads/uploads.module#UploadsModule', canActivate: [CheckClientSelection] },
  { path: 'otherGeneralCodes', loadChildren: './modules/abl/other-general-codes/other-general-codes.module#OtherGeneralCodesModule' },
  { path: 'client-maintenance', loadChildren: './modules/client-maintenance/client-maintenance.module#ClientMaintenanceModule' },
  { path: 'exceptionAnalysis', loadChildren: './modules/exception-analysis/exception-analysis.module#ExceptionAnalysisModule' },
  { path: 'udf', loadChildren: './Administration/user-defined-field/user-defined-field.module#UserDefinedFieldModule' },
  // { path: 'financial', loadChildren: './modules/financial/financial.module#FinancialModule', canActivate: [CheckClientSelection] },
  { path: 'factoring', loadChildren: './modules/factoring/factoring.module#FactoringModule' },
  { path: 'verificationProcess', loadChildren: './modules/abl/verification-process/verification-process.module#VerificationProcessModule', canActivate: [CheckClientSelection] },
  { path: 'loan-maintenance', loadChildren: './modules/loan-maintenance/loan-maintenance.module#LoanMaintenanceModule' },
  { path: 'webhooks', loadChildren: './modules/web-hooks/web-hooks.module#WebHooksModule' },
  { path: 'quickbook', loadChildren: './modules/quick-book/quick-book.module#QuickBookModule' },
  { path: 'qb-ar-aging-summary', loadChildren: './modules/abl/qb-ar-aging-summary/qb-ar-aging-summary.module#QbArAgingSummaryModule', canActivate: [CheckClientSelection]},
  { path: 'import-quickbooks-invoice', loadChildren: './modules/abl/import-quickbook-invoice/import-quickbook-invoice.module#ImportQuickbookInvoicesModule', canActivate: [CheckClientSelection]},
  { path: 'roll-forward-inquiry', loadChildren: './modules/abl/roll-forward-inquiry/roll-forward-inquiry.module#RollForwardInquiryModule' },
  { path: 'tableau-reports', loadChildren: './modules/tableu-reports/tableu-reports.module#TableuReportsModule' },
  { path: 'bbc-review-manual-input-history', loadChildren: './modules/abl/bbc-review-history-input/bbc-review-history-input.module#BbcReviewHistoryInputModule', canActivate: [CheckClientSelection] },
  { path: 'cssp-support', loadChildren: './modules/cssp-app/cssp-app.module#AppcsspModule' },
  { path: 'user-tour', loadChildren: './modules/user-tour/user-tour.module#UserTourModule' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
