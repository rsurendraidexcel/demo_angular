import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreditQueueComponent } from './credit-queue.component';
import { ListQueueComponent } from './list-queue/list-queue.component';
import { AddEditQueueComponent } from './add-edit-queue/add-edit-queue.component';


const routes: Routes = [
  { path: '', component: ListQueueComponent },
  { path: 'add', component: AddEditQueueComponent },
  { path: ':id', component: AddEditQueueComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);