
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { currencyPairComponent } from './currency.pair.component';
import { CurrencyPairSummary } from './currency.pair.summary';
import { currencyPairEditComponent } from './currency.pair.edit.component';
import { CurrencyPairView } from './currencypair.view';

const routes: Routes = [
   { path: '', component: CurrencyPairSummary },
   { path: 'view/:id', component: CurrencyPairView },
   { path: 'add', component: currencyPairComponent },
   { path: ':id', component: currencyPairEditComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
