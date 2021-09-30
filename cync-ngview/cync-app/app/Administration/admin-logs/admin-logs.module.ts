import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { adminLogsComponent } from './admin-logs.component';
import { routing } from './admin-logs.routing';

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [adminLogsComponent],
  exports : [adminLogsComponent]
})
export class AdminLogsModule { }
