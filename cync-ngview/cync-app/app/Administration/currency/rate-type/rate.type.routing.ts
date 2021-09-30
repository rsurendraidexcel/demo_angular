import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { rateTypeComponent } from './rate.type.component';
import { rateTypeViewComponent } from './ratetype.view.component';
import {rateTypeAddComponent} from './ratetype.add.component';

const routes: Routes = [
  { path: '', component: rateTypeComponent },
  { path: 'view/:id', component:  rateTypeViewComponent },
  { path: ':id', component:  rateTypeAddComponent },
  { path: 'add', component:  rateTypeAddComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
