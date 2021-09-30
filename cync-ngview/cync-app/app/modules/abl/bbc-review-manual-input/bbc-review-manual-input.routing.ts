import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceivablesRollforwardComponent } from './receivables-rollforward/receivables-rollforward.component';
import { InventoryRollForwardComponent } from './inventory-roll-forward/inventory-roll-forward.component';
import { AssetsInventoryComponent } from './assets-inventory/assets-inventory.component';

const routes: Routes = [
  { path: 'receivables-roll-forward', component: ReceivablesRollforwardComponent},
  { path: 'inventory-roll-forward', component: InventoryRollForwardComponent},
  {
    path: 'assets-inventory', component: AssetsInventoryComponent
  }
];
export const bbcReviewRoutes: ModuleWithProviders = RouterModule.forChild(routes);