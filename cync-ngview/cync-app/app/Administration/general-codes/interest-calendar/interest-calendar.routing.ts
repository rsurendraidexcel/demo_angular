import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterestCalendarComponent } from './interest-calendar.component';

const routes: Routes = [
  { path: '', component:  InterestCalendarComponent}
  // { path: 'view/:id', component:  InterestCalendarComponent },
  // { path: ':id', component:  InterestCalendarComponent },
  // { path: 'add', component:  InterestCalendarComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
