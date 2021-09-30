import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdvanceRateComponent } from './advance-rate.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';
import { ListCollateralAdvanceRateComponent } from '@app/modules/abl/bbc-preference-setup/advance-rate/collateral-advance-rate/list-collateral-advance-rate/list-collateral-advance-rate.component';
import { ListSeasonalAdvanceRateComponent } from '@app/modules/abl/bbc-preference-setup/advance-rate/seasonal-advance-rate/list-seasonal-advance-rate/list-seasonal-advance-rate.component';

const routes: Routes = [
  { path: '', component:  AdvanceRateComponent,children : [
    { path: 'collateral-advance-rate', loadChildren: "./collateral-advance-rate/collateral-advance-rate.module#CollateralAdvanceRateModule"},
    { path: 'seasonal-advance-rate', loadChildren: "./seasonal-advance-rate/seasonal-advance-rate.module#SeasonalAdvanceRateModule",canActivate:[CheckClientSelection]},
    ]
  }
];
  
export const routing: ModuleWithProviders = RouterModule.forChild(routes);

