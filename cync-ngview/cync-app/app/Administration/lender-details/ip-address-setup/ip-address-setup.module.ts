import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './ip-address-setup.routing';
import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormvalidationService } from '@cyncCommon/formValidation/formvalidation.service';
import { ListIpAddressSetupComponent } from './list-ip-address-setup/list-ip-address-setup.component';
import { ManageIpAddressSetupComponent } from './manage-ip-address-setup/manage-ip-address-setup.component';
import { IpAddressSetupService } from './services/ip-address-setup.service' ;
import { DataTableModule,
	SharedModule,
	DialogModule,
	CheckboxModule
 } from 'primeng/primeng';

@NgModule({
	declarations: [ListIpAddressSetupComponent, ManageIpAddressSetupComponent],
	imports: [
		CommonModule,
		CommonComponentModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		routing,
		DataTableModule,
		SharedModule,
		DialogModule,
		CheckboxModule
	],
	exports: [ListIpAddressSetupComponent, ManageIpAddressSetupComponent],
	providers: [
		FormvalidationService,
		IpAddressSetupService
	]


})

export class IpAddressSetupModule { }
