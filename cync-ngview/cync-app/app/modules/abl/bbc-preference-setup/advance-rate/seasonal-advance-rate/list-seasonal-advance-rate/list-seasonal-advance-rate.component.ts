import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { SeasonalAdvanceRateService } from '../service/seasonal-advance-rate.service';
import { ListDivisions, Division, ListSeasonalAdvanceRate, SeasonalAdvanceRates } from '../model/seasonal-advance-rate.model';

@Component({
	selector: 'app-list-seasonal-advance-rate',
	templateUrl: './list-seasonal-advance-rate.component.html',
	styleUrls: ['./list-seasonal-advance-rate.component.css']
})
export class ListSeasonalAdvanceRateComponent implements OnInit {

	seasonalAdvanceRateGridModel: CustomGridModel;
	toogleSearchBox: boolean;
	toogleCloseBox: boolean;
	searchTerm: string = CyncConstants.BLANK_STRING;
	gridData: SeasonalAdvanceRates[] = [];
	@ViewChild(DataTable) dataTableComponent: DataTable;
	toggleEditIcon: boolean;
	toggleDeleteIcon: boolean;
	toggleReloadIcon: boolean;
	isAddPermitted: boolean;
	isEditPermitted: boolean;
	isDeletePermitted: boolean;
	isExportPermitted: boolean = true;
	isDataLoading: boolean;
	recordCount: number = -1;
	recordTotal: number;
	showTotalrecords: number = 0;
	loadCount: number = 0;
	load_more: boolean;
	showCount: number = 1;
	rowCount: number = CyncConstants.getDefaultRowCount();
	selectedRows: any[] = [];
	// array to display the export columns
	exportColumns: ExportColumn[] = [];
	toogleExportConfirmPoupup: boolean;
	isExportWarningPopupVisible: boolean;
	searchPageCount: number = 1;
	//show loader while getting data on scroll event
	showSpinner: boolean;
	//array to fix the datatable header
	dataTableElement: any = [];
	dataTableElementId: string = 'main_contents';
	divisionsList: Division[] = [];
	borrowerId: string;
	selectedDivisionValue: string = 'null';

	constructor(
		private _seasonalAdvanceRateService: SeasonalAdvanceRateService,
		private _helper: Helper,
		private _router: Router,
		private _apiMapper: APIMapper,
		private _message: MessageServices) {
		this.borrowerId = CyncConstants.getSelectedClient();
		//this.borrowerId = '37';
	}


	ngOnInit() {
		this.toogleSearchBox = true; // Show search icon on page load
		this.toogleCloseBox = false; // hide close icon on page load
		this.initializeDivisionDropdown();
		this.initializeGrid();
		//this._helper.adjustUI();
		this.setHeight();
	}

	/**
	* Initialize the Grid and get permissions
	*/
	initializeGrid() {
		this._message.showLoader(true);
		this.getPermissions();
		this.seasonalAdvanceRateGridModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: {
				getApi: this._apiMapper.endpoints[CyncConstants.GET_SEASONAL_ADVANCE_RATE_LIST].replace("{selectedClientId}", this.borrowerId),
				deleteApi: '', updateApi: ''
			},
			type: CyncConstants.SEASONAL_ADVANCE_RATE,
			columnDef: [
				{ field: 'collateral_type', header: CyncConstants.SEASONAL_ADVANCE_RATE_COLLATERAL_TYPE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'as_of_date', header: CyncConstants.SEASONAL_ADVANCE_RATE_AS_OF_DATE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'sub_limit', header: CyncConstants.SEASONAL_ADVANCE_RATE_SUB_LIMIT, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'nolv_value', header: CyncConstants.SEASONAL_ADVANCE_RATE_NOLV_VALUE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'advance_rate', header: CyncConstants.SEASONAL_ADVANCE_RATE_ADVANCE_RATE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'adjusted_advance_rate', header: CyncConstants.SEASONAL_ADVANCE_RATE_ADJUSTED_RATE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'low_value', header: CyncConstants.SEASONAL_ADVANCE_RATE_LOW_VALUE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'high_value', header: CyncConstants.SEASONAL_ADVANCE_RATE_HIGH_VALUE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'sublimit_based_on', header: CyncConstants.SEASONAL_ADVANCE_RATE_BASED_ON, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'sublimit_calculated_cap_on', header: CyncConstants.SEASONAL_ADVANCE_RATE_CAL_CAP_BY, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'sublimit_max_cap_pct', header: CyncConstants.SEASONAL_ADVANCE_RATE_MAX_CAP, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
			],
			responseKey: CyncConstants.SEASONAL_ADVANCE_RATE_RESPONSE_KEY,
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
			menuName: CyncConstants.SEASONAL_ADVANCE_RATE,
			isMoreIconsRequired: false
		};
		var updatedUrl = (this.selectedDivisionValue == 'null') ? this.seasonalAdvanceRateGridModel.apiDef.getApi : this.seasonalAdvanceRateGridModel.apiDef.getApi + '&division_code_id=' + this.selectedDivisionValue;
		this.getGridData(this.replaceApiQueryParams(updatedUrl, this.showCount));
	}

	/**
	* Initialize the division drop down
	*/
	initializeDivisionDropdown() {
		this._seasonalAdvanceRateService.getDivisions(this._apiMapper.endpoints[CyncConstants.SEASONAL_ADVANCE_RATE_DIVISIONS_LIST].replace("{selectedClientId}", this.borrowerId)).subscribe(divisionResponse => {
			this.divisionsList = divisionResponse[CyncConstants.SEASONAL_DIVISION_RESPONSE_KEY];
		})
	}

	/** 
	  * Call the helper method through service to get all the menu permissions
	  */
	getPermissions() {
		this._seasonalAdvanceRateService.getMenuPermission().subscribe(permissionsResponse => {
			this.isAddPermitted = this._seasonalAdvanceRateService.getAddPermission(permissionsResponse);
			this.isEditPermitted = this._seasonalAdvanceRateService.getEditPermission(permissionsResponse);
			this.isDeletePermitted = this._seasonalAdvanceRateService.getDeletePermissions(permissionsResponse);
		});
	}

	/**
	  * Call the api to get all Grid data
	  * @param url 
	  */
	getGridData(url: string) {
		this._seasonalAdvanceRateService.getGridData(url).subscribe(apiResponse => {
			if (apiResponse.recordTotal != undefined) {
				this.recordTotal = apiResponse.recordTotal;
				this.showTotalrecords = this.recordTotal;
			}
			this.gridData = apiResponse[this.seasonalAdvanceRateGridModel.responseKey];
			this.isDataLoading = true;
			this._message.showLoader(false);
		})
	}

	/**
	  * Replace api query params
	  * @param url 
	  * @param pageNum 
	  */
	replaceApiQueryParams(url: string, pageNum: number): string {
		return this._seasonalAdvanceRateService.replaceQueryParams(url, pageNum, this.rowCount);
	}

	/**
	* Change division type method while selecting division type dropdown value
	* @param moduleName (selected dropdown value)
	*/
	changeDivisionType(moduleName: string) {
		this.selectedDivisionValue = moduleName;
		this.showCount = 1;
		this.searchPageCount = 1;
		var updatedUrl = (this.selectedDivisionValue == 'null') ? this.seasonalAdvanceRateGridModel.apiDef.getApi : this.seasonalAdvanceRateGridModel.apiDef.getApi + '&division_code_id=' + this.selectedDivisionValue;
		this.getGridData(this.replaceApiQueryParams(updatedUrl, this.showCount));
	}

	/**
	   * On Global Search this event gets fired
	   * @param event 
	   */
	onKeyUp(event: any) {
		if (this.searchTerm == CyncConstants.BLANK_STRING || this.searchTerm == undefined || this.searchTerm == null) {
			this.toogleCloseBox = false;// hide close icon 
			this.toogleSearchBox = true;// Show search icon 
			//reinitialize page count
			this.showCount = 1;
			//reinitialize search page count
			this.searchPageCount = 1;
			//reload grid data
			var updatedUrl = (this.selectedDivisionValue == 'null') ? this.seasonalAdvanceRateGridModel.apiDef.getApi : this.seasonalAdvanceRateGridModel.apiDef.getApi + '&division_code_id=' + this.selectedDivisionValue;
			this.getGridData(this.replaceApiQueryParams(updatedUrl, this.showCount));
		} else {
			this.toogleCloseBox = true;// Show close icon
			this.toogleSearchBox = false;// Hide search icon 
			//Call the search API and reload the grid data
			this._helper.scrollTopDataTable(this.dataTableElementId);
			this.reloadGridData(this.searchTerm);
		}
	}

	/**
 * Reoload the grid data based on the search term
 * @param searchTerm 
 */
	reloadGridData(searchTerm: string) {

		/**
		 * PLEASE DONT REMOVE BELOW COMMENTED CODE
		 * If only search api is called,below code is used
		 */
		// let apiEndpoint = this._apiMapper.searchAPIs[CyncConstants.SEARCH_SEASONAL_ADVANCE_RATE];
		// apiEndpoint = apiEndpoint + searchTerm;
		// this.getGridData(apiEndpoint);

		//If sorting and pagination params are used along with search param below code is used
		var updatedUrl = (this.selectedDivisionValue == 'null') ? this.seasonalAdvanceRateGridModel.apiDef.getApi : this.seasonalAdvanceRateGridModel.apiDef.getApi + '&division_code_id=' + this.selectedDivisionValue;
		let endpoint = this.replaceApiQueryParams(updatedUrl, this.searchPageCount);
		endpoint = endpoint + '&search=' + searchTerm;
		this.getGridData(endpoint);
	}

	/**
 * On click of close icon this event gets fired
 */
	clearSearchBox() {
		this.dataTableComponent.reset();
		this.searchTerm = CyncConstants.BLANK_STRING;
		this.toogleCloseBox = false;
		this.toogleSearchBox = true;
		this.recordCount = -1;
		//reinitialize page count
		this.showCount = 1;
		//reinitialize search page count
		this.searchPageCount = 1;
		//reload grid data
		var updatedUrl = (this.selectedDivisionValue == 'null') ? this.seasonalAdvanceRateGridModel.apiDef.getApi : this.seasonalAdvanceRateGridModel.apiDef.getApi + '&division_code_id=' + this.selectedDivisionValue;
		this.getGridData(this.replaceApiQueryParams(updatedUrl, this.showCount));
	}

	/**
	* Routing to Add page
	*/
	goToAdd() {
		this._router.navigateByUrl(this._router.url + '/add');
	}

	/**
		* Routing to Edit page
		*/
	goToEdit() {
		if (this.selectedRows.length == 1) {
			this._router.navigateByUrl(this._router.url + '/' + this.selectedRows[0].id);
		}
	}

	/**
	 * On click of grid row route to edit page
	 * @param event 
	 */
	goToView(event: any) {
		if (event.type == CyncConstants.CHECKBOX_EVENT_TYPE) {
			this.updateGridIcons();
		} else if (event.type == CyncConstants.ROW_EVENT_TYPE && this.isEditPermitted) {
			this.selectedRows = [];
			let rowId = event.data.id;
			this._router.navigateByUrl(this._router.url + '/' + rowId);
		}
	}

	/**
	   * Update Edit and Delete Icons based on the row selection
	   */
	updateGridIcons() {
		this.updateDeleteIcon();
		this.updateEditIcon();
	}


	/**
	 * Update edit icon
	 */
	updateEditIcon() {
		if (this.isEditPermitted) {
			this.toggleEditIcon = this.selectedRows != undefined && this.selectedRows.length == 1;
		}
	}

	/**
	 * Update delete icon
	 */
	updateDeleteIcon() {
		if (this.isDeletePermitted) {
			this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
		}
	}

	/**
	 * On Unselect of a grid checkbox update the Icons
	 */
	unSelectChkBox() {
		this.updateGridIcons();
	}

	/**
	   * On select of all checkbox update delete icon
	   */
	selectAllChkBox() {
		this.updateDeleteIcon();
	}

	/**
 * On column search this event gets fired
 * @param event 
 */
	printFilteredData(event: any) {
		if (event.filteredValue != undefined) {
			this.recordCount = event.filteredValue.length;
			if (this.recordCount == this.gridData.length) {
				this.recordCount = -1;
			}
		}
	}

	/** 
	   * On Scroll load grid data
	  */
	onScroll(event) {
		//call helper method to fix the table header
		this._helper.fixTableHeader(event.target, this.seasonalAdvanceRateGridModel.isAdvanceSearchAvailable);
		if (this._helper.isScollbarAtBottom(this.dataTableElementId)) {
			this.load_more = true;
		} else {
			this.load_more = false;
		}
		let endpoint = '';
		if (this.load_more && this.gridData.length < this.recordTotal) {
			this.showCount = this.showCount + 1;
			if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
				this.showSpinner = true;
			}
			var updatedUrl = (this.selectedDivisionValue == 'null') ? this.seasonalAdvanceRateGridModel.apiDef.getApi : this.seasonalAdvanceRateGridModel.apiDef.getApi + '&division_code_id=' + this.selectedDivisionValue;
			if (this.searchTerm.length > 0) {
				this.searchPageCount = this.searchPageCount + 1;
				endpoint = this.replaceApiQueryParams(updatedUrl, this.searchPageCount);
				endpoint = endpoint + '&search=' + this.searchTerm;
			} else {
				endpoint = this.replaceApiQueryParams(updatedUrl, this.showCount);
			}
			this._seasonalAdvanceRateService.getGridData(endpoint).subscribe(apiResponse => {
				this.gridData = this.gridData.concat(apiResponse[this.seasonalAdvanceRateGridModel.responseKey]);
				this.showSpinner = false;
			});
		}
	}

	/** 
	   * On click of delete icon show pop up
	  */
	delete() {
		this.showConfirmationPopup();
	}

	/**
	   * Show confirmation pop up with selected records 
	   */
	showConfirmationPopup() {
		this._helper.openConfirmPopup({ "title": CyncConstants.CONFIRMATION_POPUP_TITLE, "message": this._seasonalAdvanceRateService.getConfirmationPopupMessage(this.selectedRows, 'collateral_type'), "msgType": "warning" }).subscribe(result => {
			if (result) {
				this._message.showLoader(true);
				this.deleteSelectedRecords();
			} else {
				//unselect all the checkbox
				this.selectedRows = [];
				this.updateGridIcons();
			}
		});
	}

	/**
	   * Call the API to delete selected records
	   */
	deleteSelectedRecords() {
		let apiEndpoint = this._apiMapper.endpoints[CyncConstants.DELETE_MULTIPLE_SEASONAL_ADVANCE_RATE_RECORDS];
		this._seasonalAdvanceRateService.deleteSeasonalAdvanceRates(this.selectedRows, 'id', apiEndpoint).subscribe(deleteResponse => {
			if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
				this._message.showLoader(false);
				//show success message after deleting records
				this.fireSuccessMsg(CyncConstants.DELETE_SUCCESS_MSG);
				//reload grid data after successful deletion
				this.reloadGridData(CyncConstants.BLANK_STRING);
				//unselect all the checkbox and update the grid icons
				this.selectedRows = [];
				this.updateGridIcons();

			}
		});
	}

	/**
	   * Show Success Message
	   * @param successMsg 
	   */
	fireSuccessMsg(successMsg: string) {
		this._seasonalAdvanceRateService.showSuccessMessage(successMsg);
	}

	//Export code starts

	/**
	 * Show pop up for export with column selection
	 */
	showDialogForExport() {
		this.toogleExportConfirmPoupupFlag();
		this.exportColumns = [];
		this.exportColumns = this._helper.getExportColumns(this.seasonalAdvanceRateGridModel.columnDef);
	}

	toogleExportConfirmPoupupFlag() {
		this.toogleExportConfirmPoupup = !(this.toogleExportConfirmPoupup);
	}

	exportSelectedColumns(selectedColumns: ExportColumn[]) {
		let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
		if (queryParam != undefined && queryParam.length > 0) {
			//set the apiendpoint
			let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_SEASONAL_ADVANCE_RATE].replace("{selectedClientId}", this.borrowerId);
			//hide the export popup
			this.toogleExportConfirmPoupupFlag();
			this._message.showLoader(true);
			this._seasonalAdvanceRateService.exportData(queryParam, apiEndpoint).subscribe(blob => {
				//unselect all checkboxes
				this.selectedRows = [];
				//empty all  columns in the popup
				this.exportColumns = [];
				//update grid icons
				this.updateGridIcons();
				//download the xls file
				this._helper.downloadFile(blob, this.seasonalAdvanceRateGridModel.type);
				this._message.showLoader(false);
			});
		} else {
			//If all the columns are unchecked show warning msg to select atleast one column
			this.toogleExportConfirmPoupup = true;
			this.isExportWarningPopupVisible = true;
		}
	}
	//Export code ends

	/**
    * Auto adjust height for interest rate codes
    */
	setHeight() {
		var appbody_cont = window.innerHeight;
		$(window).resize(function () {
			appbody_cont = window.innerHeight;
			if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
			if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 70) + 'px'; }
		})
		if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
		setTimeout(function () {
			if (document.getElementById("main_contents")) { document.getElementById('main_contents').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 70) + 'px'; }
		}, 50);
	}

}