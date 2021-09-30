import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListUdfDefinitionComponent } from './list-udf-definition/list-udf-definition.component';
import { ManageUdfDefinitionComponent } from './manage-udf-definition/manage-udf-definition.component';
const routes: Routes = [
	{ path: '', component: ListUdfDefinitionComponent },
	{ path: 'add', component: ManageUdfDefinitionComponent },
	{ path: ':id', component: ManageUdfDefinitionComponent }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
