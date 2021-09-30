import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { currencyHolidaysComponent } from './currency.holidays.component';
import { currencyHolidaysViewComponent } from './currency.holidays.view.component';
import { currencyHolidaysAddComponent } from './currency.holidays.add.component';
import { currencyHolidaysEditComponent } from './currency.holidays.edit.component';

const routes: Routes = [
  { path: '', component: currencyHolidaysComponent },
  { path: 'view/:id', component:  currencyHolidaysViewComponent },
  { path: 'add', component:  currencyHolidaysAddComponent },
  { path: ':id', component:  currencyHolidaysEditComponent },
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
