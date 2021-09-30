import { Component, OnInit } from '@angular/core'
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { GridModel, ColumnDefinition } from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
	selector: 'interest-rate-codes-summary-comp',
	templateUrl: './interest-rate-codes-summary.component.html'
})

export class InterestRateCodesSummaryComponent {

	model: GridModel;
	lenderId: string;
	coulmnDefinition: ColumnDefinition;

	constructor(private config: AppConfig, private _message: MessageServices, private _service: CustomHttpService) {
		this.lenderId = this.config.getConfig('lenderId');
		this.model = {

			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: 'loan_charge_codes/interest_rate_codes', deleteApi: 'loan_charge_codes/interest_rate_codes/' + this.lenderId, updateApi: 'loan_charge_codes/interest_rate_codes/' + this.lenderId },
			type: 'Interest Rate Codes',
			columnDef: [
				{ field: 'loan_type', header: 'Loan Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'rate_code', header: 'Code', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'rate_name', header: 'Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'rate_description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'rate_divisor', header: 'Daily Devisor', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'rate_precision', header: 'Precision', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
			]
		}
	}
	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this._service.setHeight();
		var appbody_cont = window.innerHeight;
		$(window).resize(function () {
			appbody_cont = window.innerHeight;
			if (document.getElementById("sec_main_contents")) { document.getElementById('sec_main_contents').style.maxHeight = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }
		})
		if (document.getElementById("sec_main_contents")) { document.getElementById('sec_main_contents').style.maxHeight = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16) + 'px'; }

	}
}