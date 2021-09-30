import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./advance-rate.routing";
import { AdvanceRateComponent } from './advance-rate.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
  declarations: [
    AdvanceRateComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,  
    RouterModule, 
    ReactiveFormsModule,
    routing
  ],
  exports : [AdvanceRateComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class AdvanceRateModule { }