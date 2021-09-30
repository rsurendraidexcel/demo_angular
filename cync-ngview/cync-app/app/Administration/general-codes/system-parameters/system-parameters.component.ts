import { Component, OnInit } from '@angular/core';
import { GridModel, ColumnDefinition } from '../../../../app-common/component/grid/grid.model';
import { AppConfig } from '../../../app.config';
import { CustomHttpService } from '../../../../app-common/services/http.service';
import { CyncConstants } from '@cyncCommon/utils/constants';

@Component({
	selector: 'app-system-parameters',
	templateUrl: './system-parameters.component.html'
})
export class SystemParametersComponent {

	model: GridModel;
	coulmnDefinition: ColumnDefinition;
	lenderId: string;

	constructor(private config: AppConfig, private _service: CustomHttpService) {
		this.lenderId = this.config.getConfig('lenderId');
		this.model = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: 'system_parameters?page=1&rows=' + CyncConstants.getDefaultRowCount(), deleteApi: '', updateApi: '' },
			type: 'System Parameters',
			columnDef: [
				{ field: 'name', header: 'Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'parameter_type', header: 'Parameter Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'value', header: 'Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
			]
		};
	}

	ngOnInit() {
		$('#cync_app_dashboard').removeClass('loading-modal-initial');
		this._service.setHeight();
	}
}
