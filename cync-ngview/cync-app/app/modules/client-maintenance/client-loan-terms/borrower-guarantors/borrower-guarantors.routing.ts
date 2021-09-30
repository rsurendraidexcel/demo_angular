import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BorrowerGuarantorsComponent } from './list-borrower-guarantors/borrower-guarantors.component';
import {BorrowerGuarantorsAddComponent} from './manage-borrower-guarantors/add.borrower-guarantors.component'

const routes: Routes = [
  { path: '', component:  BorrowerGuarantorsComponent},
  { path: 'add', component:  BorrowerGuarantorsAddComponent },
  { path: ':id', component:  BorrowerGuarantorsAddComponent },
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);