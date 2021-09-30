import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { currencyComponent } from './currency.component';
import { AuthGuard } from '../../../app-common/auth/auth';

const routes: Routes = [
  { path: '', component: currencyComponent, children : [
  { path: 'currency-definition', loadChildren: '../../../app/Administration/currency/currency-definition/currency.definition.module#CurrencyDefinitionModule', canActivate: [AuthGuard]},
  { path: 'currency-holidays', loadChildren: '../../../app/Administration/currency/currency-holidays/currency.holidays.module#CurrencyHolidaysModule', canActivate: [AuthGuard]},
  { path: 'currency-pair', loadChildren: '../../../app/Administration/currency/currency-pair/currency.pair.module#CurrencyPairModule', canActivate: [AuthGuard]},
  { path: 'exchange-rates', loadChildren: '../../../app/Administration/currency/exchange-rates/exchange.rates.module#ExchangeRatesModule', canActivate: [AuthGuard]},
  { path: 'rate-type', loadChildren: '../../../app/Administration/currency/rate-type/rate.type.module#RateTypeModule', canActivate: [AuthGuard]}
  ]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
