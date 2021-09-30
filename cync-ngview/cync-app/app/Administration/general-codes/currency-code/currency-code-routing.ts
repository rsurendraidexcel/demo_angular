import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListCurrencyCodeComponent } from './list-currency-code/list-currency-code.component'
import { ManageCurrencyCodeComponent } from './manage-currency-code/manage-currency-code.component';
const routes: Routes = [
	{ path: '', component: ListCurrencyCodeComponent },
	{ path: 'add', component: ManageCurrencyCodeComponent },
	{ path: ':id', component: ManageCurrencyCodeComponent }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);