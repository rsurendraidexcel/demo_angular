import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientMaintenanceComponent } from './client-maintenance.component';
import { Routing } from "./client-maintenance.routing";
import {MatDatepickerModule} from '@angular/material/datepicker';

@NgModule({
  imports: [
    CommonModule,
    Routing,
    MatDatepickerModule
  ],
  declarations: [ClientMaintenanceComponent],
  exports : [ClientMaintenanceComponent]
})
export class ClientMaintenanceModule { }