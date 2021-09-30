import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesRegionsComponent } from './sales-regions.component';
import {SalesRegionsNewComponent} from './sales-regions.new.component';
import {SalesRegionsViewComponent} from './sales-regions.view.component';

const routes: Routes = [
  { path: '', component:  SalesRegionsComponent},
  { path: 'view/:id', component:  SalesRegionsViewComponent },
  { path: ':id', component:  SalesRegionsNewComponent },
  { path: 'add', component:  SalesRegionsNewComponent }

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
