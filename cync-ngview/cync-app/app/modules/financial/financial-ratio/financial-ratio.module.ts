import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowFinancialRatioComponent } from './show-financial-ratio/show-financial-ratio.component';
import { FinancialRatioSummaryComponent } from './financial-ratio-summary/financial-ratio-summary.component';
import { RouterModule } from '@angular/router';
import { routing } from './financial-ratio.routing';
import { ChartModule } from 'angular2-chartjs';
import 'chartjs-plugin-zoom';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule, DataTableModule, SharedModule, DialogModule, TooltipModule } from 'primeng/primeng';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { FinancialRatioService } from './service/financial-ratio.service';
import { RadioButtonModule } from 'primeng/primeng';
import 'chartjs-plugin-datalabels';
import { DatePipe } from '@angular/common';

// Required for Displaying Project Name
import { ListProjectService } from '../financial-analyzer/service/list-project.service';
import { CustomRatiosComponent } from './custom-ratios/custom-ratios.component';
import { ListFormulaComponent } from './custom-ratios/list-formula/list-formula.component';
import { MentionModule } from './custom-ratios/auto-complete';
import {CustomRatiosService} from './custom-ratios/service/custom-ratios.service';


@NgModule({
  imports: [
    CommonModule,
    routing,
    ChartModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    RadioButtonModule,
    TooltipModule,
    DataTableModule,
    CommonComponentModule,
    MentionModule
    
  ],
  declarations: [
    ShowFinancialRatioComponent,
    FinancialRatioSummaryComponent,
    CustomRatiosComponent,
    ListFormulaComponent
  ],
 providers: [FormvalidationService, FinancialRatioService, ListProjectService, DatePipe, CustomRatiosService]
})
export class FinancialRatioModule { }
