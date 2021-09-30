import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { generalCodesComponent } from './general-codes.component';
import { AuthGuard } from '../../../app-common/auth/auth';

const routes: Routes = [
  { path: '', component: generalCodesComponent, children : [
    { path: 'sales-regions', loadChildren: '../../../app/Administration/general-codes/sales-regions/sales-regions.module#SalesRegionsModule', canActivate: [AuthGuard]},
    { path: 'naics-codes', loadChildren: '../../../app/Administration/general-codes/naics-codes/naics-codes.module#NaicsCodesModule', canActivate: [AuthGuard]},
    { path: 'comments-type', loadChildren: '../../../app/Administration/general-codes/comments-type/comments-type.module#CommentsTypeModule', canActivate: [AuthGuard]},
    { path: 'system-parameters', loadChildren: '../../../app/Administration/general-codes/system-parameters/system-parameters.module#SystemParametersModule', canActivate: [AuthGuard]},
    { path: 'adjustment', loadChildren: '../../../app/Administration/general-codes/adjustment-reasons/adjustment-reasons.module#AdjustmentReasonsModule', canActivate: [AuthGuard]},
    { path: 'interest-calendar', loadChildren: '../../../app/Administration/general-codes/interest-calendar/interest-calendar.module#InterestCalendarModule', canActivate: [AuthGuard]},
    { path: 'content', loadChildren: '../../../app/Administration/general-codes/content/letter-content.module#LetterContentModule', canActivate: [AuthGuard]},
    { path: 'templates', loadChildren: '../../../app/Administration/general-codes/templates/report-templates/report-templates.module#ReportTemplatesModule', canActivate: [AuthGuard]},
    { path: 'currency-code', loadChildren: './currency-code/currency-code.module#CurrencyCodeModule'}
  //  { path: 'reportTemplates', loadChildren: '../../../app/Administration/general-codes/templates/report-templates/report-templates.module#ReportTemplatesModule'}
  ]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
