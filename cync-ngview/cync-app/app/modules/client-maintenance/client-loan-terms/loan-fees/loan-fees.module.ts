import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { LoanFeesComponent } from './loan-fees.component';
import { routing } from "./loan-fees.routing";
import {CommonComponentModule} from "@cyncCommon/component/common.component.module";
import {LoanFeeService} from './service/loan-fees.service';

@NgModule({
  imports: [
    CommonModule,
    CommonComponentModule,
    routing
  ],
  declarations: [LoanFeesComponent],
  exports : [LoanFeesComponent],
  providers: [LoanFeeService]
})
export class LoanFeesModule { }