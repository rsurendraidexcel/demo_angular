import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialStatementsLandingComponent } from './financial-statements-landing/financial-statements-landing.component';
import { FinancialStatementsSetupBalanceSheetComponent } from '@fsBalanceModule/financial-statements-setup-balance-sheet.component';
import { FinancialStatementsSetupIncomeStatementComponent } from '@fsIncomeModule/financial-statements-setup-income-statement.component';
import { FinancialStatementsSetupCashflowComponent } from '@fsCashflowModule/financial-statements-setup-cashflow.component';
import { FinancialStatementsSetupSummaryComponent } from '@fsSummaryModule/financial-statements-setup-summary.component';

const routes: Routes = [
	{ path: ':id', component: FinancialStatementsLandingComponent },
	{ path: 'balancesheet/:id', component: FinancialStatementsSetupBalanceSheetComponent },
	{ path: 'income/:id', component: FinancialStatementsSetupIncomeStatementComponent },
	{ path: 'cashflow/:id', component: FinancialStatementsSetupCashflowComponent },
	{ path: 'summary/:id', component: FinancialStatementsSetupSummaryComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
