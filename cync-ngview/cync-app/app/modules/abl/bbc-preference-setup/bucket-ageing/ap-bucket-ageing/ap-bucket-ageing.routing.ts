import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { APBucketAgeingComponent } from './list-ap-bucket/ap-bucket-ageing.component';
import { APBucketAgeingAddComponent } from './manage-ap-bucket/manage.ap-bucket-ageing.component';

const routes: Routes = [
  { path: '', component:  APBucketAgeingComponent},
  { path: 'add', component:  APBucketAgeingAddComponent },
  { path: ':id', component:  APBucketAgeingAddComponent }, 
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);