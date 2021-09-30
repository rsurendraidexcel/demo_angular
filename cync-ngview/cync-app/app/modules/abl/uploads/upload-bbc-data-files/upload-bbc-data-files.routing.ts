import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadBBCDataFilesComponent } from './upload-bbc-data-files.component';

const routes: Routes = [
  { path: '', component: UploadBBCDataFilesComponent }

];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);