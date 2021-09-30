import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from  '@angular/http';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/primeng';
import { routing } from './user-maintenance.routing';
import { UserMaintenanceComponent} from './user-maintenance.component';

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    ButtonModule,
    RouterModule,
    routing
  ],
  declarations: [UserMaintenanceComponent],
  exports : [UserMaintenanceComponent]
})
export class UserMaintenanceModule { }
