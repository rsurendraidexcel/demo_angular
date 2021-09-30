import { Component, OnInit } from '@angular/core';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
	selector: 'app-adjustment-reasons',
	templateUrl: './adjustment-reasons.component.html'
})
export class AdjustmentReasonsComponent {

	adjustmentModel: GridModel;
	coulmnDefinition: ColumnDefinition;
	lenderId: string;

	constructor(private config: AppConfig, private _service: CustomHttpService) {
		this.lenderId = this.config.getConfig('lenderId');
		this.adjustmentModel = {

			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: '/general_codes/adjustment_reasons?page=1&rows=' + CyncConstants.getDefaultRowCount() + '&order_by=updated_at&sort_by=desc', deleteApi: '', updateApi: '' },
			type: 'Adjustment Reasons',
			columnDef: [
				{ field: 'name', header: 'Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'dilution', header: 'Dilution', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
			]
		};

	}
	ngOnInit() {
		$('#cync_app_dashboard').removeClass('loading-modal-initial');
		this._service.setHeight();
	}

}
