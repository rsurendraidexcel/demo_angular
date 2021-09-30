import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarModule, CheckboxModule, TooltipModule } from 'primeng/primeng';

import { QbArAgingSummaryRoutingModule } from './qb-ar-aging-summary-routing.module';
import { QbArAgingSummaryComponent } from './qb-ar-aging-summary/qb-ar-aging-summary.component';
import { FormsModule } from '@angular/forms';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';

@NgModule({
  declarations: [QbArAgingSummaryComponent],
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    CommonComponentModule,
    QbArAgingSummaryRoutingModule
  ]
})
export class QbArAgingSummaryModule { }
