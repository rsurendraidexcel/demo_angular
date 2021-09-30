import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuarantorsComponent } from './list-guarantors/guarantors.component';
import {GuarantorsAddComponent} from './manage-guarantors/add.guarantors.component'
const routes: Routes = [
  { path: '', component:  GuarantorsComponent}, 
  { path: 'add', component:  GuarantorsAddComponent },
  { path: ':id', component:  GuarantorsAddComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);