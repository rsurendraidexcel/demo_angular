import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountDetailsComponent } from './bank-account-details.component';

const routes: Routes = [
  { path: '', component:  BankAccountDetailsComponent }
  // { path: 'view/:id', component:   },
  // { path: ':id', component:   },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
