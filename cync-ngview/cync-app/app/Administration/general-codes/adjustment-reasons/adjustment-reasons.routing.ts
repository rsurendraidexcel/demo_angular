import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdjustmentReasonsComponent } from './adjustment-reasons.component';
import {AdjustmentReasonsNewComponent} from './adjustment-reasons.new.component';
import {AdjustmentReasonsViewComponent} from './adjustment-reasons.view.component';



const routes: Routes = [
  { path: '', component:  AdjustmentReasonsComponent},
  { path: 'add', component:  AdjustmentReasonsNewComponent },
  { path: ':id', component:  AdjustmentReasonsNewComponent },
   { path: 'view/:id', component:  AdjustmentReasonsViewComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
