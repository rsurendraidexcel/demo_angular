import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule } from '@angular/forms';
import { MessagesModule} from 'primeng/primeng';
import {AuditLogsComponent} from './audit-logs.component';
import { routing } from './audit-logs.routing';

@NgModule({
  declarations: [
    AuditLogsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    MessagesModule,
    routing
  ],
  exports : [AuditLogsComponent],
  providers: []

})
export class AuditLogsModule { }
