import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./collateral-reserves.routing";
import { CollateralReservesComponent } from './collateral-reserves.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '@cyncCommon/component/grid/grid.component';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';

@NgModule({
  declarations: [
    CollateralReservesComponent,
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [CollateralReservesComponent],
  providers: [GridComponent, FormvalidationService]
 
}) 
export class CollateralReservesModule { }