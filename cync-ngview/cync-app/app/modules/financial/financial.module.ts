import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialAnalyzerComponent } from './financial-analyzer/financial-analyzer.component';
import { FinancialStatementsComponent } from './financial-statements/financial-statements.component';
import { FinancialRatioComponent } from './financial-ratio/financial-ratio.component';
import { FinancialHighlightsComponent } from './financial-highlights/financial-highlights.component';
import { FinancialComponent } from './financial.component';
import { Routing } from './financial.routing';
import { RadioButtonModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {FileUploadModule} from 'primeng/primeng';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@NgModule({
  imports: [
    CommonModule,
    Routing,
    RadioButtonModule,
    FormsModule,
    FileUploadModule
  ],
  declarations: [
    FinancialComponent,
    FinancialAnalyzerComponent,
    FinancialStatementsComponent,
    FinancialRatioComponent,
    FinancialHighlightsComponent
  ],
  exports: [FinancialComponent],
  providers: [RadioButtonService]
})
export class FinancialModule { }

