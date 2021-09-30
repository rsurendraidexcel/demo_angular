import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule, DataTableModule, SharedModule, DialogModule, TooltipModule } from 'primeng/primeng';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { AgGridModule } from 'ag-grid-angular';
import { TabsModule } from 'ngx-bootstrap/tabs';

import { TermCodesComponent } from './term-codes.component';
import { ListTermCodesComponent } from "./list-term-codes/list-term-codes.component";
import { ManageTermCodesComponent } from "./manage-term-codes/manage-term-codes.component";
import { routing } from './term-codes.routing';
import { TermCodesService } from './service/term-codes.service';
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
        ConfirmDialogModule,
        AgGridModule.withComponents([]),
        TabsModule.forRoot()
    ],
    declarations: [
        ListTermCodesComponent,
        ManageTermCodesComponent,
        TermCodesComponent
    ],
    exports: [
        ListTermCodesComponent
    ],
    providers: [
        FormvalidationService,
        TermCodesService
    ]
})
export class TermCodesModule { }