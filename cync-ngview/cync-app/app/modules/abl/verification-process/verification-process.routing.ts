import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationProcessComponent } from './verification-process.component';
import { CheckClientSelection } from '@cyncCommon/component/ui-mgmt/check-client-selection';

const routes: Routes = [
  { path: '', component: VerificationProcessComponent, children : [
  { path: 'letter-processing', loadChildren: "./letter-processing/letter-processing.module#LetterProcessingModule" }
    ]
  }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);