import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUdfMappingComponent } from './list-udf-mapping/list-udf-mapping.component';
import { ManageUdfMappingComponent } from './manage-udf-mapping/manage-udf-mapping.component';
import { EditUdfMappingComponent } from '@app/Administration/user-defined-field/udf-mapping/edit-udf-mapping/edit-udf-mapping.component';

const routes: Routes = [
  { path: '', component:  ListUdfMappingComponent},
  { path: 'add', component:  ManageUdfMappingComponent },
  { path: ':id', component:  EditUdfMappingComponent }

];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);