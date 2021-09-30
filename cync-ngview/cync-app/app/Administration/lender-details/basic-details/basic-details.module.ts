import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './basic-details.routing';

import { BasicDetailsComponent } from './basic-details.component';
import { BasicDetailsEditComponent } from './basic-details-edit-component';

import { CommonComponentModule } from '@cyncCommon/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule, DialogModule, RadioButtonModule, CheckboxModule } from 'primeng/primeng';
import { CheckPermissionsService } from '@cyncCommon/component/roles-and-permissions/check-permissions.service';

@NgModule({
	declarations: [BasicDetailsEditComponent, BasicDetailsComponent],
	imports: [
		CommonModule,
		CommonComponentModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		routing,
		CalendarModule,
		DialogModule,
		RadioButtonModule,
		CheckboxModule
	],
	exports: [BasicDetailsEditComponent, BasicDetailsComponent],


})

export class BasicDetailsModule { }
