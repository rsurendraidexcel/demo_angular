import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThirdPartyGuarantorsComponent } from './list-third-party/third-party-guarantors.component';
import { ThirdPartyAddComponent } from './manage-third-party/add.third-party-guarantors.component';

const routes: Routes = [
  { path: '', component:  ThirdPartyGuarantorsComponent},
  { path: 'add', component:  ThirdPartyAddComponent },
  { path: ':id', component:  ThirdPartyAddComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);