import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BasicParametersComponent } from './basic-parameters.component';

const routes: Routes = [
  { path: '', component:  BasicParametersComponent}
  
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);