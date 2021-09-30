import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserMaintenanceComponent } from './user-maintenance.component';
import { AuthGuard } from '../../../app-common/auth/auth';

const routes: Routes = [
  { path: '', component: UserMaintenanceComponent, children : [
  { path: 'roles-and-permissions', loadChildren: '../../../app/Administration/user-maintenance/roles-and-permissions/roles-and-permissions.module#RolesAndPermissionsModule', canActivate: [AuthGuard]},
  { path: 'create-user', loadChildren: '../../../app/Administration/user-maintenance/create-user/create-user.module#CreateUserModule', canActivate: [AuthGuard]} ,
  { path: 'client-assignment', loadChildren: '../../../app/Administration/user-maintenance/client-assignment/client-assignment.module#ClientAssignmentModule', canActivate: [AuthGuard]}
  ] }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
