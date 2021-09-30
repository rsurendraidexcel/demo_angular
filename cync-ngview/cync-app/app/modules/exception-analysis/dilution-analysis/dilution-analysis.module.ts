import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./dilution-analysis.routing";
import { DilutionAnalysisComponent } from './dilution-analysis.component';
import {CommonComponentModule} from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
  declarations: [
    DilutionAnalysisComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [DilutionAnalysisComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class DilutionAnalysisModule { }
