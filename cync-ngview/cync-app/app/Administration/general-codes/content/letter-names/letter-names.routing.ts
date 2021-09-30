import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListLetterNamesComponent } from './list-letter-names/list-letter-names.component';
import { ManageLetterNamesComponent } from './manage-letter-names/manage-letter-names.component';


const routes: Routes = [
  { path: '', component: ListLetterNamesComponent },
  { path: 'add', component: ManageLetterNamesComponent },
  { path: ':id', component: ManageLetterNamesComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);