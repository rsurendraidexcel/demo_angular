import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherPreferencesComponent } from './other-preferences.component';

const routes: Routes = [
  { path: '', component:  OtherPreferencesComponent,children : [
  { path: 'activity-tickler', loadChildren: "./activity-tickler/activity-tickler.module#ActivityTicklerModule"},
  { path: 'comments', loadChildren: "./comments/comments.module#CommentsModule"},
  { path: 'report-comments', loadChildren: "./report-comments/report-comments.module#ReportCommentsModule"},
  { path: 'exceptions', loadChildren: "./bbc-exceptions/exceptions.module#ExceptionsModule"}

	]}
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);