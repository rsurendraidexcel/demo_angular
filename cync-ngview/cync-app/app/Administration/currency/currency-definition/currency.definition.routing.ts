import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { currencyDefitionComponent } from './currency.definition.component';
import { currencySummaryComponent } from './summary.component';
import { currencyViewComponent } from './currency.view.component';

const routes: Routes = [
  { path: '', component:  currencySummaryComponent},
  { path: 'view/:id', component:  currencyViewComponent },
  { path: ':id', component:  currencyDefitionComponent },
  { path: 'add', component:  currencyDefitionComponent }

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
