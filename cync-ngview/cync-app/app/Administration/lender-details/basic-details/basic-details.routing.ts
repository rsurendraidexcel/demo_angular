import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { BasicDetailsComponent } from './basic-details.component';
 import { BasicDetailsEditComponent } from './basic-details-edit-component';

const routes: Routes = [
  { path: '', component:  BasicDetailsEditComponent }
  //{ path: 'edit/:id/:colid', component:  BasicDetailsEditComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
