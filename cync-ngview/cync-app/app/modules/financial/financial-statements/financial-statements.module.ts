import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialStatementsLandingComponent } from './financial-statements-landing/financial-statements-landing.component';
import { FinancialStatementsSetupBalanceSheetComponent } from '@fsBalanceModule/financial-statements-setup-balance-sheet.component';
import { FinancialStatementsSetupIncomeStatementComponent } from '@fsIncomeModule/financial-statements-setup-income-statement.component';
import { FinancialStatementsSetupSummaryComponent } from '@fsSummaryModule/financial-statements-setup-summary.component';
import { RouterModule } from '@angular/router';
import { routing } from './financial-statements.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule, MessagesModule, MessageModule } from 'primeng/primeng';
import { FinancialStatementsService } from './services/financial-statements.service';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { RadioButtonModule } from 'primeng/primeng';
import { DatePipe } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FinancialStatementsSetupCashflowComponent } from '@fsCashflowModule/financial-statements-setup-cashflow.component';


@NgModule({
	imports: [
		CommonModule,
		routing,
		FormsModule,
		FileUploadModule,
		MessagesModule,
		MessageModule,
		ReactiveFormsModule,
		RadioButtonModule,
		CommonComponentModule
	],
	declarations: [
		FinancialStatementsLandingComponent,
		FinancialStatementsSetupBalanceSheetComponent,
		FinancialStatementsSetupIncomeStatementComponent,
		FinancialStatementsSetupSummaryComponent,
		FinancialStatementsSetupCashflowComponent
	],
	providers: [FinancialStatementsService, FormvalidationService, DatePipe, DecimalPipe]
})
export class FinancialStatementsModule { }
