import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferClientToUdfComponent } from './transfer-client-to-udf.component';

const routes: Routes = [
  { path: '', component: TransferClientToUdfComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
