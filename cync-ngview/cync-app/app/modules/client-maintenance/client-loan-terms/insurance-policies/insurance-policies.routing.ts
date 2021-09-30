import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InsurancePoliciesComponent } from './list-insurance-policies/insurance-policies.component';
import { InsurancePoliciesAddComponent } from './manage-insurance-policies/add-insurance-policies.component';

const routes: Routes = [
  { path: '', component:  InsurancePoliciesComponent},
  { path: 'add', component:  InsurancePoliciesAddComponent },
  { path: ':id', component:  InsurancePoliciesAddComponent },

];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);