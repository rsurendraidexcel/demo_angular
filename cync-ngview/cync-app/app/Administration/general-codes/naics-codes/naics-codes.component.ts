import { Component, OnInit } from '@angular/core';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';


@Component({
	selector: 'app-naics-codes',
	templateUrl: './naics-codes.component.html'
})
export class NaicsCodesComponent {

	naicsModel: GridModel;
	coulmnDefinition: ColumnDefinition;
	lenderId: string;

	constructor(private config: AppConfig, private _service: CustomHttpService, private _message: MessageServices) {
		this.lenderId = this.config.getConfig('lenderId');
	}

	ngOnInit() {
		$('#cync_app_dashboard').removeClass('loading-modal-initial');
		this._service.setHeight();
		
		// Grid Initialization Section
		this.naicsModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: '/general_codes/naics_codes?page=1&rows=' + CyncConstants.getDefaultRowCount() + '&order_by=updated_at&sort_by=desc', deleteApi: '', updateApi: '' },
			type: 'NAICS Codes',
			columnDef: [
				{ field: 'code', header: 'Code', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
			]
		};


	}

}
