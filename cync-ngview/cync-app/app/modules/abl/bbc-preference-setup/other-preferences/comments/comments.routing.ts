import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentsComponent } from './comments.component';
import {CommentsNewComponent} from './comments.new.component';

const routes: Routes = [
  { path: '', component:  CommentsComponent},
  { path: 'add', component:  CommentsNewComponent}
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);