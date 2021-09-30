import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from "./interest-rate-codes.routing";
import { InterestRateCodesSummaryComponent } from './interest-rate-codes-summary.component';
import { InterestRateCodesViewComponent } from './interest-rate-codes-view.component';
import { InterestRateCodesDefitionComponent } from './interest-rate-codes-defination.component';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { CheckboxModule } from 'primeng/primeng';
import { AccordionModule } from 'primeng/primeng';
import { DataTableModule, SharedModule, CalendarModule, DialogModule, SpinnerModule, ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { ListInterestRateCodesComponent } from './list-interest-rate-codes/list-interest-rate-codes.component';
import { ManageInterestRateCodesComponent } from './manage-interest-rate-codes/manage-interest-rate-codes.component';
import { GridHelper } from '@cyncCommon/utils/grid-helper';
import { InterestRateCodesService } from './service/interest-rate-codes.service';
import { ManageInterestRatesComponent } from './manage-interest-rates/manage-interest-rates.component';

@NgModule({
  declarations: [
    InterestRateCodesSummaryComponent,
    InterestRateCodesViewComponent,
    InterestRateCodesDefitionComponent,
    ListInterestRateCodesComponent,
    ManageInterestRateCodesComponent,
    ManageInterestRatesComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    routing,
    ReactiveFormsModule,
    CheckboxModule,
    AccordionModule,
    CalendarModule,
    DialogModule,
    SpinnerModule,
    ConfirmDialogModule,
    DataTableModule
  ],
  exports: [InterestRateCodesSummaryComponent],
  providers: [GridComponent, FormvalidationService, GridHelper, InterestRateCodesService]

})
export class InterestRateCodesModule { }
