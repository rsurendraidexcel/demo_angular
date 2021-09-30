import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generalCodesComponent } from '../general-codes/general-codes.component';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { routing } from './general-codes.routing';
import { CurrencyCodeComponent } from './currency-code/currency-code.component';
//import { ControlMessagesComponent } from './../../app-common/formValidation/control-messages.component';
//import { FileClassificationsComponent } from './file-classifications/file-classifications.component';
import { ReportTemplateService } from './templates/services/report-template.service';

@NgModule({
	imports: [
		CommonModule,
		routing,
		RouterModule,
		HttpModule
	],
	declarations: [generalCodesComponent, CurrencyCodeComponent],
	exports: [generalCodesComponent],
	providers: [ReportTemplateService]
})
export class GeneralCodesModule { }
