import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListFileClassificationsComponent } from './list-file-classifications/list-file-classifications.component';
import { ManageFileClassificationsComponent } from './manage-file-classifications/manage-file-classifications.component';


const routes: Routes = [
  { path: '', component:  ListFileClassificationsComponent},
  { path: ':id', component:  ManageFileClassificationsComponent },
  { path: 'add', component:  ManageFileClassificationsComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);