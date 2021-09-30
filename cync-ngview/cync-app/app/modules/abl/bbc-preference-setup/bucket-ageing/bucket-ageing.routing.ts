import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BucketAgeingComponent } from './bucket-ageing.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  {
    path: '', component: BucketAgeingComponent, children: [
      { path: 'ar-bucket-ageing', loadChildren: "./ar-bucket-ageing/ar-bucket-ageing.module#ListARBucketAgeingModule", canActivate: [CheckClientSelection] },
      { path: 'ap-bucket-ageing', loadChildren: "./ap-bucket-ageing/ap-bucket-ageing.module#ListAPBucketAgeingModule", canActivate: [CheckClientSelection] }
    ]
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);