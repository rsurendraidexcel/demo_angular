import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routing } from './abl-auto-file-uploads.routing';
import { AblAutoFileUploadsComponent } from './abl-auto-file-uploads.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTableModule, RadioButtonModule } from 'primeng/primeng';
import { ABLAutoFileUploadService } from './service/abl-file-upload.service';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';

@NgModule({
  declarations: [
    AblAutoFileUploadsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    Routing,
    DataTableModule,
    RadioButtonModule
  ],
  exports:
    [
      AblAutoFileUploadsComponent
    ],
  providers:
    [
      ABLAutoFileUploadService
    ]

})
export class AblAutoFileUploadsModule { }