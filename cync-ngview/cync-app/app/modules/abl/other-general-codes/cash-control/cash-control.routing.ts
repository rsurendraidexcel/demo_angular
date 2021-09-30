import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashControlComponent } from './cash-control.component';
import { CashControlAddComponent } from './cash-control-add/cash-control-add/cash-control-add.component';

const routes: Routes = [
  { path: '', component: CashControlComponent },
  { path: ':id', component: CashControlAddComponent },
  { path: 'add', component: CashControlAddComponent }

];

export const CashControleRoutes: ModuleWithProviders = RouterModule.forChild(routes);