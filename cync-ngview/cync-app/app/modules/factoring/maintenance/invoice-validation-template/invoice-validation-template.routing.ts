import {NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import {InvoiceValidationTemplateComponent } from './invoice-validation-template.component'
import {CyncGridComponent} from 'app-common/component/cync-grid/cync-grid.component'

const invoiceRoutes: Routes = [
  { path: '', component: InvoiceValidationTemplateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(invoiceRoutes)],
  exports: [RouterModule]
})
export class InvoiceRoutingModule {

 }
