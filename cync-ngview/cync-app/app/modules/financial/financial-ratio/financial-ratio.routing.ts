import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowFinancialRatioComponent } from './show-financial-ratio/show-financial-ratio.component';
import { FinancialRatioSummaryComponent } from './financial-ratio-summary/financial-ratio-summary.component';
import {CustomRatiosComponent} from './custom-ratios/custom-ratios.component';

const routes: Routes = [
  { path: ':id', component: FinancialRatioSummaryComponent },
  { path: ':id/view', component: ShowFinancialRatioComponent },
  { path: ':id/custom-ratios', component: CustomRatiosComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
