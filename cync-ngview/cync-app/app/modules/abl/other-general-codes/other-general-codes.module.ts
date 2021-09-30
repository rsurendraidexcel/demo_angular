import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherGeneralCodesComponent } from './other-general-codes.component';
import { routing } from "./other-general-codes.routing";

@NgModule({
  imports: [
    CommonModule,
    routing
  ],
  declarations: [OtherGeneralCodesComponent],
  exports: [OtherGeneralCodesComponent]
})
export class OtherGeneralCodesModule { }
