import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeeSetupFormComponent } from './factoring-fee-setup/fee-setup-form/fee-setup-form.component';
import { FeeTiresFormComponent } from './factoring-fee-setup/fee-tires-form/fee-tires-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddNewFeeComponent } from './factoring-fee-setup/fee-setup-form/sub-component/add-new-fee/add-new-fee.component';
import { MatDatepickerModule, MatDialogModule, MatSelectModule } from '@angular/material';
import { ViewHistoryComponent } from './factoring-fee-setup/fee-setup-form/sub-component/view-history/view-history.component';
import { AgGridModule } from 'ag-grid-angular';
import { FactoringInterestSetupComponent } from './factoring-interest-setup/factoring-interest-setup.component';
import { Routing } from "./factoring-parameters.routing";
import { PopupInterestAdjustmentRateComponent } from './factoring-interest-setup/popup-interest-adjustment-rate/popup-interest-adjustment-rate.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { DropdownModule } from 'primeng/primeng';

@NgModule({
  declarations: [FeeSetupFormComponent, FeeTiresFormComponent, AddNewFeeComponent, ViewHistoryComponent, FactoringInterestSetupComponent, PopupInterestAdjustmentRateComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSelectModule,
    Routing,
    DropdownModule,
    MatDatepickerModule,
    MatMomentDateModule,
    AgGridModule.withComponents([]),
  ],
  entryComponents: [AddNewFeeComponent, ViewHistoryComponent,PopupInterestAdjustmentRateComponent]
})
export class FactoringParametersModule { }
