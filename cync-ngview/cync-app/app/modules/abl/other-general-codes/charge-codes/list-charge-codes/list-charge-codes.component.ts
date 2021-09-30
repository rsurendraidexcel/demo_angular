import { Component, OnInit, HostListener } from '@angular/core';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { ChargeCodesService } from '../service/charge-codes-service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { Router } from '@angular/router';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { OpenPoupService } from '@app/shared/services/open-popups.service';
import { AdvanceSearchPoupService } from '@app/shared/components/advance-search-popup/advance-search-popup.service';
import { AdvanceSearch, Filters, FilterRules, FiltersModel } from '@app/shared/components/advance-search-popup/advance-search-popup.model';





@Component({
	selector: 'app-list-charge-codes',
	templateUrl: './list-charge-codes.component.html',
	styleUrls: ['./list-charge-codes.component.scss']
})

/**
 * @author : Saakshi Sharma
 */
export class ListChargeCodesComponent {
	advanceSearchModel: FiltersModel;
	listChargeCodesModel: CustomGridModel;
	//Grid Variables
	globalSearchIcon: boolean = true;
	globalSearchCloseIcon: boolean = false;
	searchTerm: string = '';
	gridData: any = [];
	loadCount = 0;
	pageNumber = 1;
	rowcount: number = CyncConstants.getDefaultRowCount();
	showmoreData: any = [];
	isAddPermitted: boolean;
	isEditPermitted: boolean;
	isDeletePermitted: boolean;
	recordTotal: number;
	selectedRows: any = [];
	toggleDeleteIcon: boolean;
	toggleEditIcon: boolean;
	dataTableElementId: string = 'cync_main_contents';
	toggleExportModal: boolean;
	toggleExportErrorModal: boolean;
	exportHeaderArray: any;
	exportRowArray: any;
	isGridDataLoaded: boolean = false;
	sortKey = 'updated_at';
	sortOrder = 'desc';
	filterRecordCount: number = -1;

	autoNewClient = 'Auto New Client'; //This is used in Html file to show checkbox for this header

	// array to display the export columns
	exportColumns: ExportColumn[] = [];

	//show loader on scroll event
	showSpinner: boolean;

	persistAdvanceSearch: any = [];

	constructor(private _customHttpService: CustomHttpService, private _popupService: OpenPoupService, private _advanceSearchPopupService: AdvanceSearchPoupService, private _router: Router, private _commonAPIs: CommonAPIs, private chargeCodeService: ChargeCodesService, private _apiMapper: APIMapper, private _helper: Helper, private _message: MessageServices) {
	}

	/**
	 * Initialize the grid model for Charge Code Values
	 */
	ngOnInit() {

		this.listChargeCodesModel = {
			//Change key name for Posting Type once API is ready
			//Also in API Mapper the search api is not working
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			type: CyncConstants.CHARGE_CODES_GRID_MODEL_TYPE,
			apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.CHARGE_CODES_GET_ALL], deleteApi: this._apiMapper.endpoints[CyncConstants.CHARGE_CODES_API], updateApi: '' },
			columnDef: [
				{ field: 'description', header: 'Charge Codes', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'trans_code', header: 'Transaction Code', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'natural_sign', header: 'Nat Sign', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'sequence', header: 'Sequence', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'frequency_desc', header: 'Frequency', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'charge_type', header: 'Charge Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'charge_value', header: 'Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'posting_type', header: 'Posting Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'source_type', header: 'Source Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'add_to_borrower', header: 'Auto New Client', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
			],
			responseKey: 'charge_code',
			isSearchAvailable: true,
			isAdvanceSearchAvailable: false,
			isAddFunctionalityRequired: true,
			isEditFunctionalityRequired: true,
			isDeleteFunctionalityRequired: true,
			isExportFunctionalityRequired: true,
			isReloadFunctionalityRequired: false,
			onlyListingComponent: false,
			showTotalRecords: true,
			searchViaAPI: true,
			menuName: 'abl_charge_codes',
			permissionRequired: true,
			isMoreIconsRequired: false
		}

		this._helper.adjustUI();


		//GRID FUNCTIONALITY BEGINS
		this.getPermissions();
		//GRID FUNCTIONALITY ENDS
	}

	/**
	 * This method replaces the request params with original value
	 * @param url 
	 */
	getAllChargeCodesAPIUrl(url: string) {
		return url.replace('{order_by}', this.sortKey).replace('{sort_by}', this.sortOrder).replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowcount.toString());
	}

	/**
	 * GRID FUNCTIONS BEGIN
	 */

	/**
	 * Method that gets called on scroll
	 */
	onScroll(event) {
		//fix datatable header

		this._helper.fixTableHeader(event.target, this.listChargeCodesModel.isAdvanceSearchAvailable);
		let load_more: boolean;
		if (this._helper.isScollbarAtBottom(this.dataTableElementId)) { load_more = true; } else { load_more = false; }
		if (load_more == true && (this.gridData.length < this.recordTotal)) {
			if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
				this.showSpinner = true;
			}
			this.pageNumber = this.pageNumber + 1;
			if (this.listChargeCodesModel.isAdvanceSearchAvailable) {
				let filterEndPoint = this._apiMapper.endpoints[CyncConstants.GET_SEARCH_DATA];
				filterEndPoint = filterEndPoint.replace('{model}', 'charge_codes').replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowcount.toString());
				this._advanceSearchPopupService.getAdvanceSearchData(filterEndPoint, this.advanceSearchModel).subscribe(res => {
					let apiResponce = JSON.parse(res._body);
					this.gridData = this.gridData.concat(apiResponce[this.listChargeCodesModel.responseKey]);
					this.showSpinner = false;
				});
			} else {
				let url = this.getAllChargeCodesAPIUrl(this.listChargeCodesModel.apiDef.getApi);
				if (this.searchTerm.length > 0) {
					url = url + encodeURIComponent(this.searchTerm);
				}
				this.chargeCodeService.getAllChargeCodes(url).subscribe(chargeCodes => {
					this.gridData = this.gridData.concat(chargeCodes[this.listChargeCodesModel.responseKey]);
					this.showSpinner = false;
					this._message.showLoader(false);
				});
			}

		}
	}

	/**
	 * Get Permissions for chargeCodes
	 */
	getPermissions() {
		let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
		let roleType = localStorage.getItem('cyncUserRole');
		if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
			this._commonAPIs.getUserPermission(this.listChargeCodesModel.menuName, userRoleId).subscribe(permissions => {
				this.isAddPermitted = this._helper.getAddPermission(permissions);
				this.isDeletePermitted = this._helper.getDeletePermission(permissions);
				this.isEditPermitted = this._helper.getEditPermission(permissions);
				this.getGridData();
			});
		} else {
			this.isAddPermitted = true;
			this.isDeletePermitted = true;
			this.isEditPermitted = true;
			this.getGridData();
		}
	}

	/**
	 * Method to get all the grid data
	 */
	getGridData() {
		this._message.showLoader(true);
		let url = this.getAllChargeCodesAPIUrl(this.listChargeCodesModel.apiDef.getApi);
		this.chargeCodeService.getAllChargeCodes(url).subscribe(chargeCodesData => {
			this.recordTotal = chargeCodesData.recordTotal;
			this.gridData = chargeCodesData[this.listChargeCodesModel.responseKey];
			this.isGridDataLoaded = true;
			this._message.showLoader(false);
		});
	}

	/**
	 * Method that gets called for global search
	 * @param event 
	 */
	onKey(event: any) {
		if (this.searchTerm == CyncConstants.BLANK_STRING || this.searchTerm == undefined || this.searchTerm == null) {
			this.searchTerm = '';
			this.globalSearchCloseIcon = false;
			this.globalSearchIcon = true;
		}
		else {
			this.listChargeCodesModel.isAdvanceSearchAvailable = false;
			this.globalSearchCloseIcon = true;
			this.globalSearchIcon = false;
		}


		if (this.listChargeCodesModel.searchViaAPI) {
			//Make entry for search api
			this.pageNumber = 1;
			this._helper.scrollTopDataTable(this.dataTableElementId);
			this.chargeCodeService.getAllChargeCodes(this.appendSearchTerm(this.listChargeCodesModel.apiDef.getApi, this.searchTerm)).subscribe(chargeCodesData => {
				this.gridData = chargeCodesData[this.listChargeCodesModel.responseKey];
				this.recordTotal = chargeCodesData.recordTotal;
			});
		}
	}


	/**
	 * This method appends the search Term
	 * @param url 
	 * @param searchTerm 
	 */
	appendSearchTerm(url: string, searchTerm: string): string {
		url = this.getAllChargeCodesAPIUrl(url);
		if (!(searchTerm != null && searchTerm != undefined && searchTerm.length > 0)) {
			searchTerm = '';
		}
		url = url + encodeURIComponent(searchTerm);
		return url;
	}

	/**
	 * This method gets called on click of Add Icon
	 */
	goToAdd() {
		this._router.navigateByUrl(this._router.url + '/add');
	}

	/**
	 * Method when edit icon is clicked
	 * @param event 
	 */
	goToEdit() {
		if (this.isEditPermitted && this.selectedRows !== undefined && this.selectedRows.length == 1) {
			this._router.navigateByUrl(this._router.url + "/" + this.selectedRows[0].id);
		}
	}

	/**
	 * Method when delete icon is clicked
	 */
	delete() {
		let idsToBeDeleted = [];
		let descForSelectedIds = [];
		for (let ids of this.selectedRows) {
			idsToBeDeleted.push(ids.id);
			descForSelectedIds.push(ids.description)
		}
		const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to delete ' + descForSelectedIds + '?', 'msgType': 'warning' };
		this._helper.openConfirmPopup(popupParam).subscribe(result => {
			if (result) {
				this.deleteSelectedRows(idsToBeDeleted);
			} else {
				//unselect all checkbox
				this.selectedRows = [];
				this.updateGridIcons();
			}
		});
	}

	/**
	 * this method will take selected rows id and will call api to delete thoese records   * 
	 * @param idsToBeDeleted
	 */
	deleteSelectedRows(idsToBeDeleted: any[]) {
		let deleteEndpoint = this.listChargeCodesModel.apiDef.deleteApi + '?ids=' + idsToBeDeleted;
		this.chargeCodeService.deleteChargeCodes(deleteEndpoint).subscribe(response => {
			this._helper.showApiMessages(CyncConstants.DELETE_MESSAGE, 'success');
			this.pageNumber = 1;
			this.selectedRows = [];
			this.updateGridIcons();
			this.getGridData();
		});
	}

	/**
	 * Method to update add/edit icons
	 */
	updateGridIcons() {
		if (this.isDeletePermitted) {
			this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
		}
		if (this.isEditPermitted) {
			this.toggleEditIcon = this.selectedRows != undefined && this.selectedRows.length == 1;
		}
	}

	/**
	 * 
	 * @param selectedRow 
	 */
	goToView(selectedRow: any) {
		let event: any = selectedRow.originalEvent;
		if (selectedRow.type == 'checkbox') {
			this.updateGridIcons();
		} else if (selectedRow.type == 'row' && this.isEditPermitted) {
			this.selectedRows = '';
			let rowId = selectedRow.data.id;
			this._router.navigateByUrl(this._router.url + "/" + rowId);
		}
	}

	/**
	 * Method gets called when all the checkboxes are checked	
	 */
	selectAllChkBox() {
		if (this.isDeletePermitted) {
			this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
		}
	}

	/**
	 * Method when we uncheck a checkbox
	 */
	unSelectChkBox() {
		this.updateGridIcons();
	}

	/**
	 * This method enables the export dialog which has checkboxes for the columns to be exported
	 */
	showDialogForExport() {
		this.exportColumns = [];
		this.exportColumns = this._helper.getExportColumns(this.listChargeCodesModel.columnDef);
		this.toggleExportModal = true;
	}

	/**
	 * This method gets called to export the columns
	 * @param exportedCol 
	 */
	exportSelectedColumns(selectedColumns: ExportColumn[]) {
		let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
		if (queryParam != undefined && queryParam.length > 0) {
			//set the apiendpoint
			let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_INELIGIBILITY_REASONS];
			//hide the export popup
			this.toggleExportModal = false;
			this._message.showLoader(true);
			this.chargeCodeService.exportChargeCodes(this.listChargeCodesModel.apiDef.getApi.split('?')[0], queryParam).subscribe(blob => {
				//console.log('::export successful');
				//unselect all checkboxes
				this.selectedRows = [];
				//empty all  columns in the popup
				this.exportColumns = [];
				//download the xls file
				this.updateGridIcons();
				this.downloadFile(blob, this.listChargeCodesModel.type);
				this._message.showLoader(false);
			});
		} else {
			//If all the columns are unchecked show warning msg to select atleast one column
			this.toggleExportErrorModal = true;
			this.toggleExportModal = true;
		}
	}

	/**
	 * This method gets called to download excel file from blob response returned from api
	 * @param exportedCol 
	 */
	//Changes for CYNCUXT-2863 begin
	downloadFile(blob: Blob, filename: string) {
		//Changes for CYNCUXT-2863 begin
		let xlsFileName = filename + '.xls';
		if (window.navigator && window.navigator.msSaveOrOpenBlob) {
			window.navigator.msSaveOrOpenBlob(blob, xlsFileName);
		} else {
			var link = document.createElement('a');
			document.body.appendChild(link);
			link.href = window.URL.createObjectURL(blob);
			link.download = xlsFileName; //changed to xls as per Anoop's review
			link.click();
		}
	}

	/**
	 * Method to clear the global search
	 */
	clearSearchBox() {
		this.pageNumber = 1;
		this._helper.scrollTopDataTable(this.dataTableElementId);
		this.getGridData();
		this.searchTerm = '';
		this.globalSearchCloseIcon = false;
		this.globalSearchIcon = true;
		this.filterRecordCount = -1;
	}

	/**
	 * This method is used to update the record count when column filter is used
	 * @param event 
	 */
	printFilteredData(event) {
		if (event.filteredValue != undefined) {
			this.filterRecordCount = event.filteredValue.length;
			if (this.filterRecordCount == this.gridData.length) {
				this.filterRecordCount = -1;
			}
		}
	}

	/**
    * Open advance search popup
    */

	openAdvanceSearchPoup() {
		this._helper.scrollTopDataTable(this.dataTableElementId);
		let getColumnEndPoint = this._apiMapper.endpoints[CyncConstants.GET_COLUMNS];
		getColumnEndPoint = getColumnEndPoint.replace('{model}', 'ChargeCode');

		let getOperatorEndPoint = this._apiMapper.endpoints[CyncConstants.GET_OPERATORS];

		let getDropdownEndPoint = this._apiMapper.endpoints[CyncConstants.GET_DROPDOWN_VALUES];
		getDropdownEndPoint = getDropdownEndPoint.replace('{model}', 'ChargeCode');

		let apiModel = { 'columnAPI': getColumnEndPoint, 'operatorAPI': getOperatorEndPoint, 'dropdownAPI': getDropdownEndPoint };
		const requestParam = { 'apiModel': apiModel, 'persistedAdvanceSearch': this.persistAdvanceSearch };
		this._popupService.openAdvanceSearchPoup(requestParam).subscribe(data => {
			this.persistAdvanceSearch = data;

			if (data.get('allowSearch').value) {
				this.getAdvanceSearchData(data.get('advanceSearchForms').value, data.get('groupOp').value);
			}
		});
	}

	/**
	* return search data based on the search criteria
	*/
	private getAdvanceSearchData(model: AdvanceSearch[], groupOp: string) {
		this.pageNumber = 1;
		this._message.showLoader(true);
		this.listChargeCodesModel.isAdvanceSearchAvailable = true;
		let filters = new Filters();
		let filterRules = [];
		model.forEach(element => {
			let filterRule = new FilterRules();
			filterRule.data = element.data;
			filterRule.field = element.field;
			filterRule.op = element.op;
			filterRules.push(filterRule);
		});
		filters.groupOp = groupOp;
		filters.rules = filterRules;
		let requestBody = new FiltersModel();
		requestBody.filters = filters;
		this.advanceSearchModel = requestBody;
		let filterEndPoint = this._apiMapper.endpoints[CyncConstants.GET_SEARCH_DATA];
		filterEndPoint = filterEndPoint.replace('{model}', 'charge_codes').replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowcount.toString());
		this._advanceSearchPopupService.getAdvanceSearchData(filterEndPoint, requestBody).subscribe(res => {
			let apiResponce = JSON.parse(res._body);
			this.gridData = apiResponce[this.listChargeCodesModel.responseKey];
			this.recordTotal = apiResponce.recordTotal;
			this._message.showLoader(false);
		});
	}


}
