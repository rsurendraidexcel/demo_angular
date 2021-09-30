import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListQueueComponent } from './list-queue/list-queue.component';
import { AddEditQueueComponent } from './add-edit-queue/add-edit-queue.component';
import { RouterModule } from '@angular/router';
import { routing } from './credit-queue.routing';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CheckboxModule, DataTableModule, SharedModule, DialogModule,TooltipModule } from 'primeng/primeng';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
//import { ListProjectService } from './service/list-project.service';
//import { FinancialStatementsService} from './../financial-statements/services/financial-statements.service';
import { CreditQueueComponent} from './credit-queue.component';

import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import {OverlayPanelModule,CalendarModule} from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CreditQueueService } from './service/credit-queue.service';
import{CustomTooltip} from '@cyncCommon/component/custom-tooltip/custom-tooltip.component';
import { CustomDateComponent } from '@cyncCommon/component/custom-datepicker/custom-date-component.component';

@NgModule({
  imports: [
    CommonModule,
    routing,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    TooltipModule,
    ConfirmDialogModule,AgGridModule.withComponents([CustomTooltip,CustomDateComponent]),TabsModule.forRoot(),
    OverlayPanelModule,CalendarModule
  ],
  declarations: [
    ListQueueComponent,
    AddEditQueueComponent,
    CreditQueueComponent,
    CustomTooltip,CustomDateComponent
  ],
    exports: [ListQueueComponent],
    providers: [FormvalidationService,CreditQueueService]
})
export class CreditQueueModule { }