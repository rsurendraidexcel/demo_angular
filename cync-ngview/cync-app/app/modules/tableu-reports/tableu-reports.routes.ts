import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TableuReportsComponent } from './tableu-reports.component';

const routes: Routes = [
  {path: 'debtor-overview', component: TableuReportsComponent},
  {path: 'client-overview', component: TableuReportsComponent},
  {path: 'factoring', loadChildren: './factoring/factoring-reports.module#FactoringReportsModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableauReportsRoutesModule { }