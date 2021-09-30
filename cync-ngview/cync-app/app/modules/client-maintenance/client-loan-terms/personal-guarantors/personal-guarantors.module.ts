import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterModule} from '@angular/router';
import { routing } from "./personal-guarantors.routing";
import { PersonalGuarantorsComponent } from './list-personal-guarantors/personal-guarantors.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalGuarantorsAddComponent } from './manage-personal-guarantors/add-personal-guarantors.component';
import { PersonalGuarantorsService } from './service/personal-guarantors.service'


@NgModule({
  declarations: [
    PersonalGuarantorsComponent,
    PersonalGuarantorsAddComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [PersonalGuarantorsComponent],
  providers: [PersonalGuarantorsService]
 
}) 
export class PersonalGuarantorsModule { }