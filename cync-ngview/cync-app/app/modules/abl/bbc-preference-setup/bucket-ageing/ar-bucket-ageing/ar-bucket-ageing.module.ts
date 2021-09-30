import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";
import { routing } from "./ar-bucket-ageing.routing";
import { ARBucketAgeingComponent } from './list-ar-bucket/ar-bucket-ageing.component';
import { ARBucketAgeingAddComponent } from './manage-ar-bucket/manage.ar-bucket-ageing.component';
import  {CommonComponentModule} from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ARBucketService } from './service/ar-bucket-ageing.service'

@NgModule({
  declarations: [
    ARBucketAgeingComponent,
    ARBucketAgeingAddComponent
  ],
  imports: [
    CommonModule,  
    CommonComponentModule,
    FormsModule,   
    ReactiveFormsModule,
    routing
  ],
  exports : [ARBucketAgeingComponent],
  providers: [ARBucketService]
 
}) 
export class ListARBucketAgeingModule { }