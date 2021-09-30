import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';
import { routing } from "./loan-type.routing";
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListLoanTypeComponent } from './list-loan-type/list-loan-type.component';
import { ManageLoanTypeComponent } from './manage-loan-type/manage-loan-type.component';
import { LoanTypeService } from './service/loan-type.service'

@NgModule({
	declarations: [
		ListLoanTypeComponent,
		ManageLoanTypeComponent
	],
	imports: [
		CommonModule,
		CommonComponentModule,
		FormsModule,
		ReactiveFormsModule,
		routing
	],
	exports: [
		ListLoanTypeComponent
	],
	providers: [
		LoanTypeService
	]
})

export class LoanTypeModule { }
