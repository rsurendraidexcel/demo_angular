import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FinancialAnalyzerComponent } from './financial-analyzer.component';
import { ListProjectsComponent } from './list-projects/list-projects.component';
import { ManageProjectsComponent } from './manage-projects/manage-projects.component';


const routes: Routes = [
  { path: '', component: ListProjectsComponent },
  { path: 'add', component: ManageProjectsComponent },
  { path: ':id', component: ManageProjectsComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);
