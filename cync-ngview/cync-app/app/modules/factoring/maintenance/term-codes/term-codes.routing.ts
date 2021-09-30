import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListTermCodesComponent } from "./list-term-codes/list-term-codes.component";
import { ManageTermCodesComponent } from "./manage-term-codes/manage-term-codes.component";

const routes: Routes = [
  { path: '', component: ListTermCodesComponent },
  { path: 'add', component: ManageTermCodesComponent },
  { path: ':id', component: ManageTermCodesComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);