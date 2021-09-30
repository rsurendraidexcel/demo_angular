import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListExceptionsComponent } from './list-exceptions/list-exceptions.component';
import { ManageExceptionsComponent } from './manage-exceptions/manage-exceptions.component';

const routes: Routes = [
  { path: '', component: ListExceptionsComponent },
  { path: ':id', component: ManageExceptionsComponent },
  { path: 'add', component: ManageExceptionsComponent }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);