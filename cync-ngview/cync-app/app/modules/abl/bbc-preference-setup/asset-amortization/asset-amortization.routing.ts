import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssetAmortizationComponent } from './asset-amortization.component';

const routes: Routes = [
  { path: '', component:  AssetAmortizationComponent}
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);