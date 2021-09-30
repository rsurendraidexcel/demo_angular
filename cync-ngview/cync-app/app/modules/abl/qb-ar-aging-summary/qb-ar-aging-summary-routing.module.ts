import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QbArAgingSummaryComponent } from './qb-ar-aging-summary/qb-ar-aging-summary.component';

const routes: Routes = [
  { path: '', component: QbArAgingSummaryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QbArAgingSummaryRoutingModule { }
