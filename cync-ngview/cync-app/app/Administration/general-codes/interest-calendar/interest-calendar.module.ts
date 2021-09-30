import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routing } from './interest-calendar.routing';
import { InterestCalendarComponent } from './interest-calendar.component';

import { CommonComponentModule } from '../../../../app-common/component/common.component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridComponent } from '../../../../app-common/component/grid/grid.component';

import { CalendarModule, DialogModule, SpinnerModule } from 'primeng/primeng';
import { CheckPermissionsService } from '../../../../app-common/component/roles-and-permissions/check-permissions.service';

@NgModule({
	declarations: [InterestCalendarComponent],
	imports: [
		CommonModule,
		CommonComponentModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule,
		routing,
		CalendarModule,
		DialogModule,
		SpinnerModule
	],
	exports: [InterestCalendarComponent],
	providers: [GridComponent]

})

export class InterestCalendarModule {


}
