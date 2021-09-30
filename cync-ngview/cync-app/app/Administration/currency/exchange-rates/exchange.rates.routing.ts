import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { exchangeRatesComponent } from './exchange.rates.component';
import { exchangeRatesViewComponent } from './exchange.rates.view.component';
import { exchangeRatesEditComponent } from './exchange.rates.edit.component';
import { exchangeRatesViewAllComponent } from './exchange.rates.viewAll.component';

const routes: Routes = [
  { path: '', component: exchangeRatesViewAllComponent },
  { path: 'view/:id', component:  exchangeRatesViewAllComponent },
  { path: 'add', component:  exchangeRatesEditComponent },
  { path: ':id', component:  exchangeRatesEditComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
