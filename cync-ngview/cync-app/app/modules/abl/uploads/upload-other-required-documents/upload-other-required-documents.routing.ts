import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadOtherRequiredDocumentComponent } from './upload-other-required-documents.component';

const routes: Routes = [
  { path: '', component: UploadOtherRequiredDocumentComponent }
];
export const routing: ModuleWithProviders = RouterModule.forChild(routes);