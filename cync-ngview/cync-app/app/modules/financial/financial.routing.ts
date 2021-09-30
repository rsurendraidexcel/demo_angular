import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialComponent } from './financial.component';
const routes: Routes = [
  {
    path: '', component: FinancialComponent, children: [
      { path: 'financial-analyzer', loadChildren: './financial-analyzer/financial-analyzer.module#FinancialAnalyzerModule' },
      { path: 'financial-statements', loadChildren: './financial-statements/financial-statements.module#FinancialStatementsModule' },
      { path: 'financial-ratio', loadChildren: './financial-ratio/financial-ratio.module#FinancialRatioModule' },
      { path: 'financial-highlights', loadChildren: './financial-highlights/financial-highlights.module#FinancialHighlightsModule' },
    ]
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
