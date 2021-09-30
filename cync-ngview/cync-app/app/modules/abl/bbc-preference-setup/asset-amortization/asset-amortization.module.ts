import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./asset-amortization.routing";
import { AssetAmortizationComponent } from './asset-amortization.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
  declarations: [
    AssetAmortizationComponent,
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [AssetAmortizationComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class AssetAmortizationModule { }