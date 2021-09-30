import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AblQbInvoiceComponent } from './abl-qb-invoice/abl-qb-invoice.component';

const routes: Routes = [
  {
    path: 'abl-qb-invoice', component: AblQbInvoiceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuickBookRoutingModule { }
