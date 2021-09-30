import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleSettingComponent } from './role-setting.component';

const routes: Routes = [
  { path: '', component:  RoleSettingComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
