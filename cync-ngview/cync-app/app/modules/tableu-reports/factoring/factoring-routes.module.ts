import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FactReportsComponent } from './fact-reports/fact-reports.component';

const routes: Routes = [
  { path: '', component: FactReportsComponent},
  { path: 'open-invoice', component: FactReportsComponent},
  { path: 'portfolio-arbalance', component: FactReportsComponent},
  { path: 'processing-status', component: FactReportsComponent},
  { path: 'purchase-summary', component: FactReportsComponent},
  { path: 'reserve-activity', component: FactReportsComponent},
  { path: 'broker-outstanding', component: FactReportsComponent},
  { path: 'broker-paid-commission', component: FactReportsComponent},
  { path: 'eom-client-analysis', component: FactReportsComponent},
  { path: 'payment-history', component: FactReportsComponent},
  { path: 'reserve-activity', component: FactReportsComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FactoringRouteModule { }
