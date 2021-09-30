import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';
import { RouterModule } from '@angular/router';
import { routing } from './financial-analyzer.routing';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CheckboxModule, DataTableModule, SharedModule, DialogModule,TooltipModule } from 'primeng/primeng';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ListProjectService } from './service/list-project.service';
import { FinancialStatementsService} from './../financial-statements/services/financial-statements.service';


import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';


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
    ConfirmDialogModule
  ],
  declarations: [
    ListProjectsComponent,
    ManageProjectsComponent
  ],
    exports: [ListProjectsComponent],
    providers: [FormvalidationService, ListProjectService,FinancialStatementsService]
})
export class FinancialAnalyzerModule { }