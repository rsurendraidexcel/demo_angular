import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RollForwardInquiryComponent } from './roll-forward-inquiry/roll-forward-inquiry.component';

const routes: Routes = [
  {
    path: '', component: RollForwardInquiryComponent
  }
];
export const rollInquiryRoutes: ModuleWithProviders = RouterModule.forChild(routes);