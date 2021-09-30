import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListClientTransactionComponent } from './list-client-transaction/list-client-transaction.component';
import { ViewClientTransactionComponent } from './view-client-transaction/view-client-transaction.component';

const routes: Routes = [
  { path: '', component: ListClientTransactionComponent },
  { path: 'view/:id', component: ViewClientTransactionComponent }

];
export const ROUTING: ModuleWithProviders = RouterModule.forChild(routes);