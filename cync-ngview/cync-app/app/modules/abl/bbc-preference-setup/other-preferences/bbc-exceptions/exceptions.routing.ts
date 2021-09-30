import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExceptionsComponent } from './exceptions.component';
import {ExceptionsNewComponent} from './exceptions.new.component';

const routes: Routes = [
  { path: '', component:  ExceptionsComponent},
  { path: 'add', component:  ExceptionsNewComponent}
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);