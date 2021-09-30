import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routing } from './loan-maintenance.routing';
import { FormsModule } from '@angular/forms';
import { LoanMaintenanceComponent } from './loan-maintenance.component';
@NgModule({
  declarations: [LoanMaintenanceComponent],
  imports: [
    CommonModule,
    Routing,
    FormsModule
  ],
  exports: [LoanMaintenanceComponent],
})
export class LoanMaintenanceModule { }
