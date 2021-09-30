import { NgModule } from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import  {CommonComponentModule} from '../../../../app-common/component/common.component.module';
import { FormsModule } from '@angular/forms';
import { MessagesModule} from 'primeng/primeng';
import { AutomatedTaskLogsComponent } from './automated-task-logs.component';
import { routing } from './automated-task-logs.routing';

@NgModule({
  declarations: [
    AutomatedTaskLogsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    MessagesModule,
    routing
  ],
  exports : [AutomatedTaskLogsComponent],
  providers: []

})
export class AutomatedTaskLogsModule { }
