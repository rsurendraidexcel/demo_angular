import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { bbcReviewHistoryRoutes } from './bbc-review-history-input.routing';
import { InventoryRollForwardHistoryComponent } from './inventory-roll-forward-history/inventory-roll-forward-history.component';
import { InventoryRollForwardComponent } from '../bbc-review-manual-input/inventory-roll-forward/inventory-roll-forward.component';
import { BbcReviewManualInputModule } from '../bbc-review-manual-input/bbc-review-manual-input.module';

@NgModule({
  declarations: [InventoryRollForwardHistoryComponent],
  imports: [
    CommonModule,
    bbcReviewHistoryRoutes,
    BbcReviewManualInputModule
  ],
  entryComponents: [InventoryRollForwardComponent],
  schemas:
  [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class BbcReviewHistoryInputModule { }
