import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommentsTypeComponent } from './comments-type.component';
import { CommentsTypeViewComponent } from './comments-type.view.component';
import { CommentsTypeNewComponent } from './comments-type.new.component';

const routes: Routes = [
  { path: '', component:  CommentsTypeComponent},
  { path: 'view/:id', component:  CommentsTypeViewComponent },
  { path: ':id', component:  CommentsTypeNewComponent },
  { path: 'add', component:  CommentsTypeNewComponent }

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
