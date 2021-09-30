import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from "./file-classifications.routing";
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListFileClassificationsComponent } from './list-file-classifications/list-file-classifications.component';
import { ManageFileClassificationsComponent } from './manage-file-classifications/manage-file-classifications.component';
import { FileClassificationsService } from './service/file-classifications.service'

@NgModule({
  declarations: [
    ListFileClassificationsComponent,
    ManageFileClassificationsComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing
  ],
  exports: [ListFileClassificationsComponent],
  providers: [FileClassificationsService]

})
export class FileClassificationsModule { }
