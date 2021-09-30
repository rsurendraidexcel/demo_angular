import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WatchListComponent } from './watch-list.component';

const routes: Routes = [
  { path: '', component:  WatchListComponent}, 
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);