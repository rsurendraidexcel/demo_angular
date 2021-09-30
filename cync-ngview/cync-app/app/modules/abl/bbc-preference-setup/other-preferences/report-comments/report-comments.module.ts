import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./report-comments.routing";
import { ReportCommentsComponent } from './report-comments.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ReportCommentsNewComponent} from './report-comments.new.component';

@NgModule({
  declarations: [
    ReportCommentsComponent,
    ReportCommentsNewComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [ReportCommentsComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class ReportCommentsModule { }