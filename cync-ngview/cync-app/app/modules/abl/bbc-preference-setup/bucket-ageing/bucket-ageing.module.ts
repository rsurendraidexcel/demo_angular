import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { Routing } from "./bucket-ageing.routing";
import { BucketAgeingComponent } from './bucket-ageing.component';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BucketAgeingComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    Routing
  ],
  exports: [BucketAgeingComponent],
  providers: []

})
export class BucketAgeingModule { }