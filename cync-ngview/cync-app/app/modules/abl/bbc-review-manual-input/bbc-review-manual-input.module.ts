import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ReceivablesRollforwardComponent } from './receivables-rollforward/receivables-rollforward.component';
import { RollforwardDivisionCollateralComponent } from './receivables-rollforward/sub-component/rollforward-division-collateral/rollforward-division-collateral.component';
import { RollforwardlogsComponent } from './receivables-rollforward/sub-component/rollforwardlogs/rollforwardlogs.component';
import { BbcReviewService } from './services/bbc-review.service';
import { bbcReviewRoutes } from './bbc-review-manual-input.routing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RollForwardEditPopupDetailsComponent } from './receivables-rollforward/sub-component/rollforwardlogs/roll-forward-edit-popup-details/roll-forward-edit-popup-details.component';
import { MatDialogModule } from '@angular/material/dialog';
 import { CalendarModule } from 'primeng/calendar';
import { RollfrowardAddDetailsComponent } from './receivables-rollforward/sub-component/rollforwardlogs/rollfroward-add-details/rollfroward-add-details.component';
import { RouterModule } from '@angular/router';
import { InventoryRollForwardComponent } from './inventory-roll-forward/inventory-roll-forward.component';
import { ManualRollforwardEntryComponent } from './inventory-roll-forward/sub-component/manual-rollforward-entry/manual-rollforward-entry.component';
import { EditRollForwardEntryComponent } from './inventory-roll-forward/sub-component/edit-roll-forward-entry/edit-roll-forward-entry.component';
//import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import { AssetsInventoryComponent } from './assets-inventory/assets-inventory.component';
import { AssetsInventoryDateComponent } from './assets-inventory/assets-inventory-date/assets-inventory-date.component';
import { AssetsInventoryService } from './assets-inventory/assets-inventory.service';
import { IneligibleReasonDropDownComponent } from './assets-inventory/ineligible-reason-drop-down/ineligible-reason-drop-down.component';
@NgModule({
  declarations: [ReceivablesRollforwardComponent, RollforwardDivisionCollateralComponent, RollforwardlogsComponent, RollForwardEditPopupDetailsComponent, RollfrowardAddDetailsComponent, InventoryRollForwardComponent, ManualRollforwardEntryComponent, EditRollForwardEntryComponent,  AssetsInventoryComponent, AssetsInventoryDateComponent, IneligibleReasonDropDownComponent],

//import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';

  imports: [
    CommonModule,
    AgGridModule.withComponents([AssetsInventoryDateComponent, IneligibleReasonDropDownComponent]),
    bbcReviewRoutes,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CalendarModule,
    RouterModule
  ],
  entryComponents: [RollForwardEditPopupDetailsComponent, RollfrowardAddDetailsComponent, ManualRollforwardEntryComponent, EditRollForwardEntryComponent],
  providers: [BbcReviewService, AssetsInventoryService],
  exports:[InventoryRollForwardComponent]

})
export class BbcReviewManualInputModule { }
