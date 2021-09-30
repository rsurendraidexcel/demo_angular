import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationCenterComponent } from './notification-center.component';
import { AuthGuard } from '../../../app-common/auth/auth';

const routes: Routes = [
  { path: '', component: NotificationCenterComponent, children : [
   { path: 'global-setting', loadChildren: '../../../app/Administration/notification-center/global-setting/global-setting.module#GlobalSettingModule', canActivate: [AuthGuard]},
   { path: 'role-setting', loadChildren: '../../../app/Administration/notification-center/role-setting/role-setting.module#RoleSettingModule', canActivate: [AuthGuard]},
   { path: 'user-setting', loadChildren: '../../../app/Administration/notification-center/user-setting/user-setting.module#UserSettingModule', canActivate: [AuthGuard]},
   { path: 'templates', loadChildren: '../../../app/Administration/notification-center/templates/templates.component.module#templatesModule', canActivate: [AuthGuard]}
  ]}
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
