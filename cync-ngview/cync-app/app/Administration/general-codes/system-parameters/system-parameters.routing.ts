import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemParametersComponent } from './system-parameters.component';
import { SystemParametersViewComponent } from './system-parameters.view.component';
import { SystemParameterEditComponent } from './system-parameters.edit.component';

const routes: Routes = [
  { path: '', component:  SystemParametersComponent},
  { path: 'view/:id', component:  SystemParametersViewComponent },
  { path: ':id', component:  SystemParameterEditComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
