import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BbcPreferenceSetupComponent } from './bbc-preference-setup.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  {
    path: '', component: BbcPreferenceSetupComponent, children: [
      { path: 'basic-parameters', loadChildren: "./basic-parameters/basic-parameters.module#BasicParametersModule" },
      { path: 'advance-rate', loadChildren: "./advance-rate/advance-rate.module#AdvanceRateModule", canActivate: [CheckClientSelection] },
      { path: 'bucket-ageing', loadChildren: "./bucket-ageing/bucket-ageing.module#BucketAgeingModule" },
      { path: 'other-preferences', loadChildren: "./other-preferences/other-preferences.module#OtherPreferencesModule", canActivate: [CheckClientSelection] },
      { path: 'collateral-reserves', loadChildren: "./collateral-reserves/collateral-reserves.module#CollateralReservesModule" },
      { path: 'asset-amortization', loadChildren: "./asset-amortization/asset-amortization.module#AssetAmortizationModule" }

    ]
  }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);