import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from "./charge-codes.routing";
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { CheckboxModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, DialogModule } from 'primeng/primeng';
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ListChargeCodesComponent } from './list-charge-codes/list-charge-codes.component';
import { ManageChargeCodesComponent } from './manage-charge-codes/manage-charge-codes.component';
import { ChargeCodesService } from './service/charge-codes-service';

@NgModule({
  declarations: [
    ListChargeCodesComponent,
    ManageChargeCodesComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    DataTableModule,
    ConfirmDialogModule,
    DialogModule,

    routing
  ],
  exports: [ListChargeCodesComponent],
  providers: [FormvalidationService, ChargeCodesService]

})
export class ChargeCodesModule { }

