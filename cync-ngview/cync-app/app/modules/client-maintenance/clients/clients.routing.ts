import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClientsComponent } from './list-clients/list-clients.component';

const routes: Routes = [
  {
    path: '', component: ListClientsComponent
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
