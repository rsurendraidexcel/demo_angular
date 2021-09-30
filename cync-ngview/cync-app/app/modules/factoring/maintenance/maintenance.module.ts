import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgGridModule } from 'ag-grid-angular';
// import { InvoiceValidationTemplateComponent } from './invoice-validation-template/invoice-validation-template.component';
import { MaintenaceComponent } from './maintenance.componet';
import { MaintenaceRoutingModule } from './maintenace.routings';
@NgModule({
  declarations: [MaintenaceComponent],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MaintenaceRoutingModule,
    AgGridModule.withComponents([])
  ],
  exports: [MaintenaceComponent]
})
export class MaintenanceModule { }