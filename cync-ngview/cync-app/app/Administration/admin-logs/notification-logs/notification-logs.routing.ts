import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationLogsComponent } from './notification-logs.component';

const routes: Routes = [
  { path: '', component:  NotificationLogsComponent},

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
