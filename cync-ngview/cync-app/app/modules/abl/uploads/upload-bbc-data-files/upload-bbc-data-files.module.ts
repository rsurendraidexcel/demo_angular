import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Routing } from './upload-bbc-data-files.routing';
import { UploadBBCDataFilesComponent } from './upload-bbc-data-files.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/primeng';
import { UploadBBCDataFilesService } from './service/upload-bbc-data-files.service';
import { DataTableModule, RadioButtonModule, ProgressBarModule, DialogModule } from 'primeng/primeng';
import { DecimalPipe  } from '@angular/common';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";

@NgModule({
  declarations: [
    UploadBBCDataFilesComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    Routing,
    CalendarModule,
    DataTableModule,
    ProgressBarModule,
    RadioButtonModule,
    DialogModule,
    CommonComponentModule
  ],
  exports:
    [
      UploadBBCDataFilesComponent
    ],
  providers:
    [
      UploadBBCDataFilesService,
      DecimalPipe,
      FormvalidationService
    ]

})
export class UploadRequiredDocumentsModule { }