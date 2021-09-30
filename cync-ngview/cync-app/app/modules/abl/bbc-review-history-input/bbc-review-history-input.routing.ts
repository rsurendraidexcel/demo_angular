import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryRollForwardHistoryComponent } from './inventory-roll-forward-history/inventory-roll-forward-history.component';

const routes: Routes = [
  { path: 'inventory-roll-forward-history', component: InventoryRollForwardHistoryComponent}
];

export const bbcReviewHistoryRoutes: ModuleWithProviders = RouterModule.forChild(routes);

