import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClientAssignmentComponent} from './client-assignment.component';

const routes: Routes = [
  { path: '', component: ClientAssignmentComponent}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
