import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { adminLogsComponent } from './admin-logs.component';
import { AuthGuard } from '../../../app-common/auth/auth';

const routes: Routes = [
  { path: '', component: adminLogsComponent, children : [
  {path: 'audit-logs', loadChildren: '../../../app/Administration/admin-logs/audit-logs/audit-logs.module#AuditLogsModule', canActivate: [AuthGuard]},
  {path: 'automated-task-logs', loadChildren: '../../../app/Administration/admin-logs/automated-task-logs/automated-task-logs.module#AutomatedTaskLogsModule', canActivate: [AuthGuard]},
  {path: 'notification-logs', loadChildren: '../../../app/Administration/admin-logs/notification-logs/notification-logs.module#NotificationLogsModule', canActivate: [AuthGuard]}
  ] }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
