import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterestRateCodesSummaryComponent } from './interest-rate-codes-summary.component';
import { InterestRateCodesViewComponent } from './interest-rate-codes-view.component';
import { InterestRateCodesDefitionComponent } from './interest-rate-codes-defination.component';
/* New Code */
import { ListInterestRateCodesComponent } from './list-interest-rate-codes/list-interest-rate-codes.component';
import { ManageInterestRateCodesComponent } from './manage-interest-rate-codes/manage-interest-rate-codes.component';
import { ManageInterestRatesComponent } from './manage-interest-rates/manage-interest-rates.component';


const routes: Routes = [
  { path: '', component:  ListInterestRateCodesComponent},
  { path: 'view/:id', component:  InterestRateCodesViewComponent },
  { path: ':id', component:  ManageInterestRateCodesComponent },
  { path: 'add', component:  ManageInterestRateCodesComponent },
  { path: ':intId/interest-rate/add', component:  ManageInterestRatesComponent },
  { path: ':intId/interest-rate/:rateId', component:  ManageInterestRatesComponent }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);