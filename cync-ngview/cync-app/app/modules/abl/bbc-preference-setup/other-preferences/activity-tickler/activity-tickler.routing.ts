import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityTicklerComponent } from './activity-tickler.component';
import { ActivityTicklerNewComponent } from './activity-tickler.new.component';

const routes: Routes = [
  { path: '', component:  ActivityTicklerComponent},
  { path: 'add', component:  ActivityTicklerNewComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);