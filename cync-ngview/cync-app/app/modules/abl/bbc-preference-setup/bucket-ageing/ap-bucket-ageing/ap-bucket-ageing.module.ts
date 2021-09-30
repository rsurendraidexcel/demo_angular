import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { routing } from "./ap-bucket-ageing.routing";
import { APBucketAgeingComponent } from './list-ap-bucket/ap-bucket-ageing.component';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APBucketService } from './service/ap-bucket-ageing.service';
import { APBucketAgeingAddComponent } from './manage-ap-bucket/manage.ap-bucket-ageing.component';

@NgModule({
  declarations: [
    APBucketAgeingComponent,
    APBucketAgeingAddComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing
  ],
  exports: [APBucketAgeingComponent],
  providers: [APBucketService]

})
export class ListAPBucketAgeingModule { }