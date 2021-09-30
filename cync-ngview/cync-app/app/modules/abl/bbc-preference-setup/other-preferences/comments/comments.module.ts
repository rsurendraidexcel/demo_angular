import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./comments.routing";
import { CommentsComponent } from './comments.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import {CommentsNewComponent} from './comments.new.component';

@NgModule({
  declarations: [
    CommentsComponent,
    CommentsNewComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [CommentsComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class CommentsModule { }