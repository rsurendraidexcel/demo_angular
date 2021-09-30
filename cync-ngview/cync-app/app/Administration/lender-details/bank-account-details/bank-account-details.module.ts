import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DialogModule} from 'primeng/primeng';

import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { routing } from './bank-account-details.routing';

import { BankAccountDetailsComponent } from './bank-account-details.component';

import { GridComponent } from '../../../../app-common/component/grid/grid.component';

@NgModule({
  declarations: [BankAccountDetailsComponent],
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
  providers : [GridComponent]
})

export class BankAccountDetailsModule { }
