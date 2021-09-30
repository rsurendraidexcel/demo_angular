import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./activity-tickler.routing";
import { ActivityTicklerComponent } from './activity-tickler.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import {ActivityTicklerNewComponent} from './activity-tickler.new.component';

@NgModule({
  declarations: [
    ActivityTicklerComponent,
    ActivityTicklerNewComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [ActivityTicklerComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class ActivityTicklerModule { }