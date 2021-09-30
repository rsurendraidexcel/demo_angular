import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuickbooksComponent } from './quickbooks/quickbooks.component';

const routes: Routes = [
  { path: 'quickbooks', component: QuickbooksComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationsRoutingModule { }
