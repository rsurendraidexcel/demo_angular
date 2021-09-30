import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeasonalAdvanceRateComponent } from './seasonal-advance-rate.component';
import { ListSeasonalAdvanceRateComponent } from './list-seasonal-advance-rate/list-seasonal-advance-rate.component';
import { ManageSeasonalAdvanceRateComponent } from './manage-seasonal-advance-rate/manage-seasonal-advance-rate.component';

const routes: Routes = [
  { path: '', component:  ListSeasonalAdvanceRateComponent},
  { path: ':id', component:  ManageSeasonalAdvanceRateComponent },
  { path: 'add', component:  ManageSeasonalAdvanceRateComponent }
  
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);