import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ARBucketAgeingComponent } from './list-ar-bucket/ar-bucket-ageing.component';
import { ARBucketAgeingAddComponent } from './manage-ar-bucket/manage.ar-bucket-ageing.component';


const routes: Routes = [
  { path: '', component:  ARBucketAgeingComponent},
  { path: 'add', component:  ARBucketAgeingAddComponent },
  { path: ':id', component:  ARBucketAgeingAddComponent },
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);