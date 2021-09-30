import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDefinedFieldComponent } from './user-defined-field.component';
const routes: Routes = [
  {
    path: '', component: UserDefinedFieldComponent, children: [
      { path: 'udf-definition', loadChildren: './udf-definition/udf-definition.module#UdfDefinitionModule' },
      { path: 'udf-mapping', loadChildren: './udf-mapping/udf-mapping.module#UdfMappingModule' },
      { path: 'transfer-client-to-udf', loadChildren: './transfer-client-to-udf/transfer-client-to-udf.module#TransferClientToUdfModule' },
    ]
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);
