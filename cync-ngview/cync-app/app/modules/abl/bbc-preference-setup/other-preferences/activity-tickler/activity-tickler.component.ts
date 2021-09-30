import { Component, OnInit } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid//custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { navbarComponent } from '@app/navbar/navbar.component';

@Component({
	selector: 'app-activity-tickler',
	templateUrl: './activity-tickler.component.html',
	styleUrls: ['./activity-tickler.component.css']
})
export class ActivityTicklerComponent implements OnInit {

	activityTicklerModel: CustomGridModel;
	coulmnDefinition: ColumnDefinition;
	borrowerId: string;

	constructor(private _apiMapper: APIMapper,
		private helper: Helper,
		private _navbar: navbarComponent) {

		this.borrowerId = CyncConstants.getSelectedClient();

		this.activityTicklerModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: this.getEndPoint(), deleteApi: '', updateApi: '' },
			type: 'Activity Tickler',
			columnDef: [
				{ field: 'source_documents_name', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'frequency', header: 'Frequency', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'last_date', header: 'Last Period', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'next_date', header: 'Next Period', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'days_to_receipt', header: 'Days to Receipt', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'notification_days', header: 'Notification Days', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
			],
			responseKey: 'lender_tickler',
			isSearchAvailable: true,
			isAdvanceSearchAvailable: false,
			isAddFunctionalityRequired: true,
			isEditFunctionalityRequired: true,
			isDeleteFunctionalityRequired: true,
			isExportFunctionalityRequired: true,
			isReloadFunctionalityRequired: false,
			onlyListingComponent: false,
			showTotalRecords: true,
			searchViaAPI: false,
			menuName: 'Activity Tickler'
		}
	}

	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this.helper.setHeight();
		this._navbar.getUpdatedAngularMenuAndBreadCrumb();
	}

	getEndPoint() {
		let endPoint = this._apiMapper.endpoints[CyncConstants.GET_BBC_PREFERENCE_SETUP];
		endPoint = endPoint.replace("{borrowerId}", this.borrowerId);
		return endPoint;
	}
}
