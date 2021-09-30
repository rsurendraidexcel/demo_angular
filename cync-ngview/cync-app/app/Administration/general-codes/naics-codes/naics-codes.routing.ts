import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NaicsCodesComponent } from './naics-codes.component';
import { NaicsCodesNewComponent } from './naics-codes.new.component';
import { NaicsCodesViewComponent } from './naics-codes.view.component';

const routes: Routes = [
  { path: '', component:  NaicsCodesComponent},
  { path: 'view/:id', component:  NaicsCodesViewComponent },
  { path: ':id', component:  NaicsCodesNewComponent },
  { path: 'add', component:  NaicsCodesNewComponent }

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
