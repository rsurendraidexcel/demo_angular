import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule,DialogModule} from 'primeng/primeng';

import { CommonComponentModule } from "../../../../app-common/component/common.component.module";
import { routing } from "./bank-account-details-new.routing";

import { BankAccountDetailsNewComponent } from './bank-account-details-new.component';

import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@NgModule({
  declarations: [BankAccountDetailsNewComponent],
  imports: [
		    CommonModule,
		    CommonComponentModule,
		    FormsModule,
		    ReactiveFormsModule,
		    RouterModule,
		    routing,
		    CalendarModule,
		    DialogModule
	     ],
  exports : [],
  providers :[GridComponent]
}) 

export class BankAccountDetailsNewModule { }