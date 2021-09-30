import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { CheckboxModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, CalendarModule, DialogModule, SpinnerModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { CashControlComponent } from './cash-control.component';
import { CashControleRoutes } from './cash-control.routing';
import { CashControlAddComponent } from './cash-control-add/cash-control-add/cash-control-add.component';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [
    CashControlComponent,
    CashControlAddComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    RouterModule,
    CashControleRoutes,
    AgGridModule.withComponents([]),
    ReactiveFormsModule,
    CheckboxModule,
    AccordionModule,
    CalendarModule,
    DialogModule,
    SpinnerModule,
    ConfirmDialogModule,
    DataTableModule
  ],
  exports: [],
  providers: [GridComponent, FormvalidationService]

})
export class CashControlModule { }
