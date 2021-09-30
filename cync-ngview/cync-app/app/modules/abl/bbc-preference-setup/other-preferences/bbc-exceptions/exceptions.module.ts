import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./exceptions.routing";
import { ExceptionsComponent } from './exceptions.component';
import {ExceptionsNewComponent} from './exceptions.new.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';


@NgModule({
  declarations: [
    ExceptionsComponent,
    ExceptionsNewComponent,
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [ExceptionsComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class ExceptionsModule { }