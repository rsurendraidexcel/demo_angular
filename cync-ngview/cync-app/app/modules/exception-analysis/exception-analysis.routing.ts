import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExceptionAnalysisComponent } from './exception-analysis.component';  

const routes: Routes = [
  { path: '', component: ExceptionAnalysisComponent, children : [
  { path: 'tickler-tasks', loadChildren: "./tickler-tasks/tickler-tasks.module#TicklerTasksModule"},
  { path: 'watchlist-statistics-reportings', loadChildren: "./watch-list-statistics-reporting/watch-list.module#WatchListModule"},
  { path: 'exception-reporting', loadChildren: "./exception-reporting/exception-reporting.module#ExceptionReportingModule"},
  { path: 'dilution-analysis', loadChildren: "./dilution-analysis/dilution-analysis.module#DilutionAnalysisModule"},
  { path: 'document-compliance-reporting', loadChildren: "./document-compliance-reporting/document-compliance-reporting.module#DocumentComplianceReportingModule"}
  ] }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);