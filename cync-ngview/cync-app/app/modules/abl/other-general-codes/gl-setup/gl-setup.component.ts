import { Component, OnInit } from '@angular/core';
import { GridModel, ColumnDefinition } from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import { CustomHttpService } from '@cyncCommon/services/http.service';

@Component({
	selector: 'gl-setup-comp',
	templateUrl: './gl-setup.component.html'
})
export class GlSetUpComponent {

	glSetupModel: GridModel;
	coulmnDefinition: ColumnDefinition;
	lenderId: string;

	constructor(private config: AppConfig, private _service: CustomHttpService) {
		this.lenderId = this.config.getConfig('lenderId');
		this.glSetupModel = {

			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: 'gl_account_details', deleteApi: '', updateApi: '' },
			type: 'GL Setup',
			columnDef: [
				{ field: 'charge_code', header: 'Charge Code', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'gl_account_no_debit', header: 'Debit Account No', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'gl_account_name_debit', header: 'Debit Account Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'gl_account_no_credit', header: 'Credit Account No', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'gl_account_name_credit', header: 'Credit Account Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }

			]
		}
	}

	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this._service.setHeight();
	}
}