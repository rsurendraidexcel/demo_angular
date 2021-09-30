import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from "./guarantors.routing";
import { GuarantorsComponent } from './list-guarantors/guarantors.component';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module"
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GuarantorsAddComponent } from './manage-guarantors/add.guarantors.component'
import { GuarantorsService } from './service/guarantors.service.component'
import { AutoCompleteModule } from 'primeng/primeng';


@NgModule({
  declarations: [
    GuarantorsComponent,
    GuarantorsAddComponent
  ],
  imports: [
    CommonModule,
    CommonComponentModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    AutoCompleteModule
  ],
  exports: [GuarantorsComponent],
  providers: [GuarantorsService]

})
export class GuarantorsModule { }