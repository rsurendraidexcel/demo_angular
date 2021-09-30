import { Component, OnInit } from '@angular/core';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { MessageServices } from '../../../../app-common/component/message/message.component';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
	selector: 'app-sales-regions',
	templateUrl: './sales-regions.component.html'
})
export class SalesRegionsComponent implements OnInit {

	salesRegionsModel: GridModel;
	coulmnDefinition: ColumnDefinition;

	constructor(private _service: CustomHttpService, private _servicemessage: MessageServices) {
		this.salesRegionsModel = {

			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: '/general_codes/sales_regions?page=1&rows=' + CyncConstants.getDefaultRowCount() + '&order_by=updated_at&sort_by=desc', deleteApi: '', updateApi: '' },
			type: 'Sales Regions',
			columnDef: [
				{ field: 'region', header: 'Region', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'name', header: 'Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
			]
		};

	}

	ngOnInit() {
		$('#cync_app_dashboard').removeClass('loading-modal-initial');
		this._service.setHeight();
		//this._servicemessage.cync_notify(null, null, 0);
	}

}
