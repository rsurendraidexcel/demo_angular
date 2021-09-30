import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AblAutoFileUploadsComponent } from './abl-auto-file-uploads.component';

const routes: Routes = [
  { path: '', component: AblAutoFileUploadsComponent }

];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);