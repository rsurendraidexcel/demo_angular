import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RolesAndPermissionsComponent } from './roles-and-permissions.component';

const routes: Routes = [
  { path: '', component: RolesAndPermissionsComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
