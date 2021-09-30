import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from '@angular/router';
import { IneligibleAdvancesComponent } from './ineligible-advances.component';
import { routing } from "./ineligible-advances.routing";
import {IneligibleAdvancesService} from './service/ineligible-advances.service';
import {CommonComponentModule} from "@cyncCommon/component/common.component.module";
import {DataTableModule} from 'primeng/primeng';

@NgModule({
  imports: [
    CommonModule,
    routing,
    CommonComponentModule,
    DataTableModule
  ],
  declarations: [IneligibleAdvancesComponent],
  exports : [IneligibleAdvancesComponent],
  providers: [IneligibleAdvancesService]
})
export class IneligibleAdvancesModule { }