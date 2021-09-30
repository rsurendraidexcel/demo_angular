import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./client-loan-terms.routing";
import { ClientLoanComponent } from './client-loan-terms.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ClientLoanComponent,
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [ClientLoanComponent], 
}) 
export class ClientLoanTermsModule { }