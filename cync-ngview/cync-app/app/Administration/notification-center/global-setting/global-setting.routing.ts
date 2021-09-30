import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GlobalSettingComponent } from './global-setting.component';

const routes: Routes = [
  { path: '', component:  GlobalSettingComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
