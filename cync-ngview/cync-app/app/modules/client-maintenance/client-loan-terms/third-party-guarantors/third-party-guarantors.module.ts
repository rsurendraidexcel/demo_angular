import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./third-party-guarantors.routing";
import { ThirdPartyGuarantorsComponent } from './list-third-party/third-party-guarantors.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThirdPartyAddComponent } from './manage-third-party/add.third-party-guarantors.component';
import { ThirdPartyService } from './service/third-party.service'


@NgModule({
  declarations: [
    ThirdPartyGuarantorsComponent,
    ThirdPartyAddComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [ThirdPartyGuarantorsComponent],
  providers: [ThirdPartyService]
 
}) 
export class ThirdPartyGuarantorsModule { }