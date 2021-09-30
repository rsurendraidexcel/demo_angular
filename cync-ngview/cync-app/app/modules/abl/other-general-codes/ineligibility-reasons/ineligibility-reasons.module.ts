import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from './ineligibility-reasons.routing';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ListIneligibilityReasonsComponent } from './list-ineligibility-reasons/list-ineligibility-reasons.component';
import { ManageIneligibilityReasonsComponent } from './manage-ineligibility-reasons/manage-ineligibility-reasons.component';
import { IneligibilityReasonsService } from './services/ineligibility-reasons.service';
import {CheckboxModule} from 'primeng/primeng';
import { DataTableModule, SharedModule, DialogModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    ListIneligibilityReasonsComponent,
    ManageIneligibilityReasonsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    CheckboxModule,
    DataTableModule,
    DialogModule,
    SharedModule
  ],
  exports: [ListIneligibilityReasonsComponent],
  providers: [
    FormvalidationService,
    IneligibilityReasonsService
  ]

})
export class IneligibilityReasonsModule { }