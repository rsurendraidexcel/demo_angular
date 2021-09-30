import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./borrower-guarantors.routing";
import { BorrowerGuarantorsComponent } from './list-borrower-guarantors/borrower-guarantors.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {BorrowerGuarantorsAddComponent} from './manage-borrower-guarantors/add.borrower-guarantors.component'
import { BorrowerGuarantorsService } from './service/borrower-guarantors.service.component'


@NgModule({
  declarations: [
    BorrowerGuarantorsComponent,
    BorrowerGuarantorsAddComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [BorrowerGuarantorsComponent],
  providers: [BorrowerGuarantorsService]
 
}) 
export class BorrowerGuarantorsModule { }