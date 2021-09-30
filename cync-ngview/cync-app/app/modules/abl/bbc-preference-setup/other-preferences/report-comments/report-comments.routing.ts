import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReportCommentsComponent } from './report-comments.component';
import { ReportCommentsNewComponent } from './report-comments.new.component';

const routes: Routes = [
  { path: '', component:  ReportCommentsComponent},
  { path: 'add', component:  ReportCommentsNewComponent }
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);