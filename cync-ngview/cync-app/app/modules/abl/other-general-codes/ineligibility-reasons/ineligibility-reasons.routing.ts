import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListIneligibilityReasonsComponent } from './list-ineligibility-reasons/list-ineligibility-reasons.component';
import { ManageIneligibilityReasonsComponent} from './manage-ineligibility-reasons/manage-ineligibility-reasons.component';

const routes: Routes = [
  { path: '', component:  ListIneligibilityReasonsComponent},
  { path: ':id', component:  ManageIneligibilityReasonsComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);