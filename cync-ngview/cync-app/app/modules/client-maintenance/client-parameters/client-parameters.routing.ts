import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientParametersComponent } from './client-parameters.component';
import { BbcFilesRequiredComponent } from './bbc-files-required/bbc-files-required.component';

const routes: Routes = [
{path:'bbc-files-required',component:BbcFilesRequiredComponent}
];
export const ClientParametersRouting: ModuleWithProviders = RouterModule.forChild(routes);