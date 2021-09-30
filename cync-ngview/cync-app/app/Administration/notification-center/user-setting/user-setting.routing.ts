import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSettingComponent } from './user-setting.component';

const routes: Routes = [
  { path: '', component:  UserSettingComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
