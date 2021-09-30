import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLoanTypeComponent } from './list-loan-type/list-loan-type.component';
import { ManageLoanTypeComponent } from './manage-loan-type/manage-loan-type.component';

const routes: Routes = [
	{ path: '', component: ListLoanTypeComponent },
	{ path: ':id', component: ManageLoanTypeComponent },
	{ path: 'add', component: ManageLoanTypeComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);