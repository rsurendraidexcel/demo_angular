import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportQuickbookInvoiceComponent } from './import-quickbook-invoice/import-quickbook-invoice.component';

const routes: Routes = [
  { path: '', component: ImportQuickbookInvoiceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportQuickbookInvoicesRoutingModule { }
