import { Component, OnInit } from '@angular/core';
import { GridModel, ColumnDefinition } from '@cyncCommon/component/grid/grid.model';
import { AppConfig } from '@app/app.config';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';


@Component({
	selector: 'app-tickler-tasks',
	templateUrl: './tickler-tasks.component.html'
})
export class TicklerTasksComponent {

	ticklerModel: GridModel;
	coulmnDefinition: ColumnDefinition;
	lenderId: string;

	constructor(private config: AppConfig, private _service: CustomHttpService, private _message: MessageServices) {
		this.lenderId = this.config.getConfig('lenderId');
		this.ticklerModel = {

			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: '/tickler_tasks?page=1&rows=' + CyncConstants.getDefaultRowCount(), deleteApi: '', updateApi: '' },
			type: 'Tickler Tasks',
			columnDef: [

				{ field: 'borrower_name', header: 'Client', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'source_documents_name', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'task_frequency', header: 'Frequency', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'current_date', header: 'Current Period', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'due_date', header: 'Due Date', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'notified_date', header: 'Notified', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'completion_status', header: 'Completion Status', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
			]
		}

	}
	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this._service.setHeight();
		//this._message.cync_notify(null,null,0);
	}



}