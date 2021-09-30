import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UploadsComponent } from './uploads.component';

const routes: Routes = [
  {
    path: '', component: UploadsComponent, children: [
      {
        path: 'upload-bbc-data-files',
        loadChildren: './upload-bbc-data-files/upload-bbc-data-files.module#UploadRequiredDocumentsModule'
      },
      {
        path: 'upload-other-required-documents',
        loadChildren: './upload-other-required-documents/upload-other-required-documents.module#BbcHistoricalDataProcessModule'
      },
      {
        path: 'abl-auto-file-uploads',
        loadChildren: './abl-auto-file-uploads/abl-auto-file-uploads.module#AblAutoFileUploadsModule'
      }
    ]
  }
];
export const Routing: ModuleWithProviders = RouterModule.forChild(routes);