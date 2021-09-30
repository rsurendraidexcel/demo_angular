import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { ConfirmDialogModule } from 'primeng/primeng';
import { OverlayPanelModule,CalendarModule} from 'primeng/primeng';
import { CheckboxModule, DataTableModule, DialogModule,TooltipModule } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular';
import { TransactionLogRoutingModule } from './transaction-logs.routing';
import { FundsEmployedComponent } from './funds-employed/funds-employed.component';
import { TransactionLogsComponent } from './transaction-logs.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TransactionLogRoutingModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,
    AgGridModule.withComponents([]),
    OverlayPanelModule,
    CalendarModule
  ],
  declarations: [ FundsEmployedComponent, TransactionLogsComponent],
  exports: [],
  providers: []
})
export class TransactionLogsModule{ }