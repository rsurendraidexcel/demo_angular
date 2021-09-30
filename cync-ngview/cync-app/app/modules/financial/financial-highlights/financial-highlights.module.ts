import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowProjectHighlightsComponent } from './show-project-highlights/show-project-highlights.component';
import { RouterModule } from '@angular/router';
import { routing } from './financial-highlights.routing';
import { RadioButtonModule } from 'primeng/primeng';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChartModule } from 'angular2-chartjs';
import 'chartjs-plugin-zoom';

// Required for Displaying Project Name
import { ListProjectService } from '../financial-analyzer/service/list-project.service';

import { FinancialHighlightsService } from './service/financial-highlights.service';
import { FinancialRatioService } from '../financial-ratio/service/financial-ratio.service';
import { DatePipe } from '@angular/common';
import 'chartjs-plugin-datalabels';
import { CommonComponentModule } from "@cyncCommon/component/common.component.module";

@NgModule({
	imports: [
		CommonModule,
		routing,
		RadioButtonModule,
		FormsModule,
		ChartModule,
		CommonComponentModule

	],
	declarations: [ShowProjectHighlightsComponent],
	providers: [ListProjectService, FinancialHighlightsService, FinancialRatioService, DatePipe]
})
export class FinancialHighlightsModule { }
