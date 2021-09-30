import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutomatedTaskLogsComponent } from './automated-task-logs.component';

const routes: Routes = [
  { path: '', component:  AutomatedTaskLogsComponent},

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
