import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './upload-other-required-documents.routing';
import { UploadOtherRequiredDocumentComponent } from './upload-other-required-documents.component';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ABLOtherFileUploadService } from './service/upload-other-required-documents.service';
import { DataTableModule, RadioButtonModule, CalendarModule, ProgressBarModule } from 'primeng/primeng';

@NgModule({
  declarations: [
    UploadOtherRequiredDocumentComponent,
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    DataTableModule,
    RadioButtonModule,
    CalendarModule,
    ProgressBarModule
  ],
  exports: [
    UploadOtherRequiredDocumentComponent
  ],
  providers:
    [
      ABLOtherFileUploadService
    ]
})
export class BbcHistoricalDataProcessModule { }