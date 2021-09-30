import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CreateUserComponent} from './create-user.component';
import {CreateUserViewComponent} from './create-user.component.view';
import {CreateUserNewComponent} from './create-user.component.new';

const routes: Routes = [
  { path: '', component: CreateUserComponent},
  { path: 'view/:id', component:  CreateUserViewComponent },
  { path: ':id', component:  CreateUserNewComponent },
  { path: 'add', component:  CreateUserNewComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
