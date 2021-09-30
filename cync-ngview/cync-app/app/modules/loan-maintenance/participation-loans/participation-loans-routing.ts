import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapLoansComponent } from './map-loans/map-loans.component';

const routes: Routes = [
  {path:'map-loans', component:MapLoansComponent}];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
