import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./insurance-policies.routing";
import { InsurancePoliciesComponent } from './list-insurance-policies/insurance-policies.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsurancePoliciesAddComponent } from './manage-insurance-policies/add-insurance-policies.component';
import { InsPoliciesService } from './service/insurance-policies.service'


@NgModule({
  declarations: [
    InsurancePoliciesComponent,
    InsurancePoliciesAddComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [InsurancePoliciesComponent],
  providers: [InsPoliciesService]
 
}) 
export class InsurancePoliciesModule { }