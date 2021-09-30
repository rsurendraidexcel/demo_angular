import {NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceValidationTemplateComponent } from './invoice-validation-template/invoice-validation-template.component';
import { MaintenaceComponent } from './maintenance.componet';

const MaintenaceRoutes: Routes = [
  { 	path: '', component: MaintenaceComponent  },
	{ 	path: 'invoice-validation-template', component: InvoiceValidationTemplateComponent  },
];
@NgModule({
  imports: [RouterModule.forChild(MaintenaceRoutes)],
  exports: [RouterModule]
})
export class MaintenaceRoutingModule { }