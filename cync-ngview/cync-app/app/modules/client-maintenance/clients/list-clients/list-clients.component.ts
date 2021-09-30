import { Component, OnInit } from '@angular/core';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ClientService } from '../services/client.service';

@Component({
	selector: 'list-client-details',
	templateUrl: './list-clients.component.html'
})
export class ListClientsComponent implements OnInit {

	clientCreationModel: CustomGridModel;
	coulmnDefinition: ColumnDefinition;
	showCount: number = 1;
	rowDisplay: number = 25;
	apiResponse: any[] = [];
	totalRecords: number = 0;
	dataLoaded: boolean = false;

	constructor(private _apiMapper: APIMapper,
		private helper: Helper,
		private _msgService: MessageServices,
		private _clientService: ClientService) {
	}

	ngOnInit() {
		$("#cync_app_dashboard").removeClass("loading-modal-initial");
		this.helper.setHeight();
		this.clientCreationModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: { getApi: '', deleteApi: '', updateApi: '' },
			type: 'Client Details Summary',
			columnDef: [
				{ field: 'client_name', header: 'Client Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'short_name', header: 'Short Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'client_number', header: 'Client Number', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'currency_name', header: 'Currency', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'naics_code_id', header: 'NAICS Code', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'email_id', header: 'Email ID', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'manager_name', header: 'Manager', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'active', header: 'Status', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
			],
			responseKey: 'borrowers',
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
			menuName: 'Client Details Summary'
		}
		this.getClientDetails();
	}

	/**
	 * 
	 */
	getClientDetails() {
		this._msgService.showLoader(true);
		let currentObject = this;
		let apiEnpPoint = currentObject.getEndPoint(this.showCount);
		this._clientService.listClient(apiEnpPoint).subscribe(data => {
			//console.log("client details --> " + JSON.stringify(data));
			this.dataLoaded = true;
			currentObject.apiResponse = JSON.parse(data._body).borrowers;
			console.log("this.apiresponse", this.apiResponse);
			currentObject.totalRecords = JSON.parse(data._body).recordTotal;
			if (this.dataLoaded == true) {
				this._msgService.showLoader(false);
			}
		});
	}

	/**
	 * 
	 */
	getEndPoint(count: number): string {
		let endPoint = this._apiMapper.endpoints[CyncConstants.GET_CLIENT_DETAILS];
		endPoint = endPoint.replace('{pageNumber}', count);
		endPoint = endPoint.replace('{numOfRows}', this.rowDisplay);
		console.log("endpoint", endPoint);
		return endPoint;
	}
}
