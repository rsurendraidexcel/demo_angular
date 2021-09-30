import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { IneligibilityReasonsService } from '../services/ineligibility-reasons.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ListIneligibilityReasonsResponse, IneligibilityReasons } from '../models/ineligibility-reasons.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ExportColumn } from '@app/shared/models/export-columns.model';

@Component({
	selector: 'app-list-ineligibility-reasons',
	templateUrl: './list-ineligibility-reasons.component.html',
	styleUrls: ['./list-ineligibility-reasons.component.scss']
})

/**
 * @author Nandini
 */
export class ListIneligibilityReasonsComponent implements OnInit {
	ineligibilityReasonsGridModel: CustomGridModel;
	toogleSearchBox: boolean;
	toogleCloseBox: boolean;
	searchTerm: string = CyncConstants.BLANK_STRING;
	gridData: IneligibilityReasons[] = [];
	@ViewChild(DataTable) dataTableComponent: DataTable;
	toggleEditIcon: boolean;
	toggleDeleteIcon: boolean;
	toggleReloadIcon: boolean;
	isAddPermitted: boolean;
	isEditPermitted: boolean;
	isDeletePermitted: boolean;
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
	dataTableElementId: string = 'cync_main_contents';

	constructor(
		private _ineligibilityReasonsService: IneligibilityReasonsService,
		private _helper: Helper,
		private _router: Router,
		private _apiMapper: APIMapper,
		private _message: MessageServices) { }



	ngOnInit() {
		this.toogleSearchBox = true; // Show search icon on page load
		this.toogleCloseBox = false; // hide close icon on page load
		this._helper.adjustUI();
		this.initializeGrid();

	}

	/**
	 * Initialize the Grid and get permissions
	 */

	initializeGrid() {
		this._message.showLoader(true);
		this.getPermissions();
		this.ineligibilityReasonsGridModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: {
				getApi: this._apiMapper.endpoints[CyncConstants.GET_INELIGIBILITY_REASONS_LIST],
				deleteApi: '', updateApi: ''
			},
			type: CyncConstants.INELIGIBILITY_REASONS,
			columnDef: [
				{ field: 'code', header: CyncConstants.INELIGIBILITY_REASON_CODE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'description', header: CyncConstants.DESCRIPTION, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'system_defined', header: CyncConstants.SYSTEM_DEFINED, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'calculate_on_negative_balance', header: CyncConstants.CALCULATE_ON_NEGATIVE_ELIGIBLE_BALANCE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
				{ field: 'calculate_on_negative_debtor_balance', header: CyncConstants.CALCULATE_ON_NEGATIVE_DEBTOR_BALANCE, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false },
			],
			responseKey: CyncConstants.INELIGIBILITY_REASON_RESPONSE_KEY,
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
			menuName: CyncConstants.INELIGIBILITY_REASONS,
			isMoreIconsRequired: false
		};
		this.getGridData(this.replaceApiQueryParams(this.ineligibilityReasonsGridModel.apiDef.getApi, this.showCount));
	}

	/**
	 * Replace api query params
	 * @param url
	 * @param pageNum
	 */
	replaceApiQueryParams(url: string, pageNum: number): string {
		return this._ineligibilityReasonsService.replaceQueryParams(url, pageNum, this.rowCount);
	}


	/**
	 * Call the helper method through service to get all the menu permissions
	*/
	getPermissions() {
		let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
		let roleType = localStorage.getItem('cyncUserRole');
		if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
			this._ineligibilityReasonsService.getMenuPermission().subscribe(permissionsResponse => {
				//console.log(":::permissionsResponse----", permissionsResponse);
				this.isAddPermitted = this._ineligibilityReasonsService.getAddPermission(permissionsResponse);
				this.isEditPermitted = this._ineligibilityReasonsService.getEditPermission(permissionsResponse);
				this.isDeletePermitted = this._ineligibilityReasonsService.getDeletePermissions(permissionsResponse);
	
			});
		}else{
			this.isAddPermitted = true;
			this.isDeletePermitted = true;
			this.isEditPermitted = true;
		}
		
	}

	/**
	 * Call the api to get all Grid data
	 * @param url
	 */
	getGridData(url: string) {
		this._ineligibilityReasonsService.getGridData(url).subscribe(apiResponse => {
			if (apiResponse.recordTotal != undefined) {
				this.recordTotal = apiResponse.recordTotal;
				this.showTotalrecords = this.recordTotal;
			}
			this.gridData = apiResponse[this.ineligibilityReasonsGridModel.responseKey];
			this.isDataLoading = true;
			this._message.showLoader(false);
		})
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
			this.getGridData(this.replaceApiQueryParams(this.ineligibilityReasonsGridModel.apiDef.getApi, this.showCount));
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
		// let apiEndpoint = this._apiMapper.searchAPIs[CyncConstants.SEARCH_INELIGIBILITY_REASONS];
		// apiEndpoint = apiEndpoint + searchTerm;
		// this.getGridData(apiEndpoint);

		//If sorting and pagination params are used along with search param below code is used
		let endpoint = this.replaceApiQueryParams(this.ineligibilityReasonsGridModel.apiDef.getApi, this.searchPageCount);
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
		this.getGridData(this.replaceApiQueryParams(this.ineligibilityReasonsGridModel.apiDef.getApi, this.showCount));
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
		//console.log(":::printFilteredData");
		if (event.filteredValue != undefined) {
			this.recordCount = event.filteredValue.length;
			if (this.recordCount == this.gridData.length) {
				this.recordCount = -1;
			}
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
		//console.log("::selectedRows----", this.selectedRows);
		this._helper.openConfirmPopup({ "title": CyncConstants.CONFIRMATION_POPUP_TITLE, "message": this._ineligibilityReasonsService.getConfirmationPopupMessage(this.selectedRows, 'code'), "msgType": "warning" }).subscribe(result => {
			if (result) {
				//console.log("user has clicked on yes");
				this._message.showLoader(true);
				this.deleteSelectedRecords();
			} else {
				//console.log("user has clicked on cancel");
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
		let apiEndpoint = this._apiMapper.endpoints[CyncConstants.DELETE_MULTIPLE_INELIGIBILITY_REASONS_RECORDS];
		this._ineligibilityReasonsService.deleteInEligibilityReasons(this.selectedRows, 'id', apiEndpoint).subscribe(deleteResponse => {
			//console.log("::deleteResponse----", deleteResponse);
			if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
				this._message.showLoader(false);
				this.showCount = 1;
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
		this._ineligibilityReasonsService.showSuccessMessage(successMsg);
	}

	//Export code starts

	/**
	 * Show pop up for export with column selection
	 */
	showDialogForExport() {
		this.toogleExportConfirmPoupupFlag();
		this.exportColumns = [];
		this.exportColumns = this._helper.getExportColumns(this.ineligibilityReasonsGridModel.columnDef);
	}

	toogleExportConfirmPoupupFlag() {
		this.toogleExportConfirmPoupup = !(this.toogleExportConfirmPoupup);
	}

	exportSelectedColumns(selectedColumns: ExportColumn[]) {
		//console.log("::selectedColumns---", selectedColumns);
		let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
		if (queryParam != undefined && queryParam.length > 0) {
			//set the apiendpoint
			let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_INELIGIBILITY_REASONS];
			//hide the export popup
			this.toogleExportConfirmPoupupFlag();
			this._message.showLoader(true);
			this._ineligibilityReasonsService.exportData(queryParam, apiEndpoint).subscribe(blob => {
				//console.log('::export successful');
				//unselect all checkboxes
				this.selectedRows = [];
				//empty all  columns in the popup
				this.exportColumns = [];
				//update grid icons
				this.updateGridIcons();
				//download the xls file
				this._helper.downloadFile(blob, this.ineligibilityReasonsGridModel.type);
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
	 * On Scroll load grid data
	*/
	onScroll(event) {
		//call helper method to fix the table header
		this._helper.fixTableHeader(event.target, this.ineligibilityReasonsGridModel.isAdvanceSearchAvailable);
		if (this._helper.isScollbarAtBottom(this.dataTableElementId)) {
			this.load_more = true;
		} else {
			this.load_more = false;
		}
		let endpoint = '';
		if (this.load_more && this.gridData.length < this.recordTotal) {
			this.showCount = this.showCount + 1;
			if(CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY){
				this.showSpinner = true;
			}
			if (this.searchTerm.length > 0) {
				this.searchPageCount = this.searchPageCount + 1;
				endpoint = this.replaceApiQueryParams(this.ineligibilityReasonsGridModel.apiDef.getApi, this.searchPageCount);
				endpoint = endpoint + '&search=' + this.searchTerm;
			} else {
				endpoint = this.replaceApiQueryParams(this.ineligibilityReasonsGridModel.apiDef.getApi, this.showCount);
			}
			this._ineligibilityReasonsService.getGridData(endpoint).subscribe(apiResponse => {
				this.gridData = this.gridData.concat(apiResponse[this.ineligibilityReasonsGridModel.responseKey]);
				this.showSpinner = false;
			});
		}
	}

}
