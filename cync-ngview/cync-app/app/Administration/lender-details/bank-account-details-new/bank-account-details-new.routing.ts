import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BankAccountDetailsNewComponent } from './bank-account-details-new.component';

const routes: Routes = [
  { path: '', component:  BankAccountDetailsNewComponent }
  // { path: 'view/:id', component:   },
  // { path: ':id', component:   },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes); 