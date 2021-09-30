import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TicklerTasksComponent } from './tickler-tasks.component';

const routes: Routes = [
  { path: '', component:  TicklerTasksComponent}, 
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);