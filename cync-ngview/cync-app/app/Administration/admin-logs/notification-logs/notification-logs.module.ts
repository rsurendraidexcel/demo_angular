import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule } from '@angular/forms';
import { MessagesModule} from 'primeng/primeng';
import { NotificationLogsComponent } from './notification-logs.component';
import { routing } from './notification-logs.routing';

@NgModule({
  declarations: [
    NotificationLogsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    MessagesModule,
    routing
  ],
  exports : [NotificationLogsComponent],
  providers: []

})
export class NotificationLogsModule { }
