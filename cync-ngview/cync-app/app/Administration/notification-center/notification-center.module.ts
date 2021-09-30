import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationCenterComponent } from './notification-center.component';
import { HttpModule} from  '@angular/http';
import { RouterModule} from '@angular/router';
import { routing } from './notification-center.routing';

@NgModule({
  imports: [
    CommonModule,
    routing,
    RouterModule,
    HttpModule
  ],
  declarations: [NotificationCenterComponent],
  exports : [NotificationCenterComponent]
})

export class NotificationCenterModule { }

