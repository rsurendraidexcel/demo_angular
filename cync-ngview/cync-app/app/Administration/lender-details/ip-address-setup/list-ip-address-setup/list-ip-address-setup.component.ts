import { Component, OnInit, ViewChild } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { DataTable } from 'primeng/primeng';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { IpAddressSetupService } from '../services/ip-address-setup.service' ;
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { ListIPAddressSetup, IPAddressType, IPAddressRecord } from '@app/Administration/lender-details/ip-address-setup/models/ip-address-setup.model';

@Component({
  selector: 'app-list-ip-address-setup',
  templateUrl: './list-ip-address-setup.component.html',
  styleUrls: ['./list-ip-address-setup.component.scss']
})
export class ListIpAddressSetupComponent implements OnInit {

  assetsPath = CyncConstants.getAssetsPath();
	gridModel: CustomGridModel;
	toogleSearchBox: boolean;
	toogleCloseBox: boolean;
	searchTerm = CyncConstants.BLANK_STRING;
	gridData: any[] = [];
	@ViewChild(DataTable) dataTableComponent: DataTable;
	toggleEditIcon: boolean;
	toggleDeleteIcon: boolean;
	isAddPermitted: boolean;
	isEditPermitted: boolean;
	isDeletePermitted: boolean;
	isDataLoading: boolean;
	recordCount = -1;
	recordTotal: number;
	loadCount = 0;
	load_more: boolean;
	showCount = 1;
	rowCount = CyncConstants.getDefaultRowCount();
	selectedRows: any[] = [];
	// array to display the export columns
	exportColumns: ExportColumn[] = [];
	toogleExportConfirmPoupup: boolean;
	isExportWarningPopupVisible: boolean;
	// show loader while getting data on scroll event
	showSpinner: boolean;
	dataTableElementId = CyncConstants.P_DATA_TABLE_ELEMENT_ID;
	// Cync Support Team Ip related variables
	isShowSupportIps:boolean;
	supportIps: IPAddressRecord[];
	supportIpType:string;
	supportIpRanges: IPAddressType[];

  constructor(
		private _ipAddressSetupService: IpAddressSetupService,
		private _helper: Helper,
		private _router: Router,
		private _apiMapper: APIMapper,
		private _message: MessageServices) { }

	ngOnInit() {
		this.toogleSearchBox = true; // Show search icon on page load
		this.toogleCloseBox = false; // hide close icon on page load
		this.initializeGrid();
	}

	/**
	 * Method to return the Datatable Element Id
	 */
	getDataTableElementId() {
		return CyncConstants.P_DATA_TABLE_ELEMENT_ID;
  }
  
  /**
	* Initialize the Grid and get permissions
	*/
	initializeGrid() {
		this._message.showLoader(true);
		this.gridModel = {
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			apiDef: {
				getApi: this._apiMapper.endpoints[CyncConstants.GET_IP_ADDRESS_SETUP_LIST],
				deleteApi: this._apiMapper.endpoints[CyncConstants.DELETE_IP_ADDRESS_SETUP],
				updateApi: '',
				exportApi: this._apiMapper.endpoints[CyncConstants.EXPORT_IP_ADDRESS_SETUP]
			},
			type: CyncConstants.IP_ADDRESS_SETUP_SUMMARY,
			columnDef: [
				{
					field: 'name', header: CyncConstants.IP_ADDR_NAME,
					sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true
				},
				{
					field: 'description', header: CyncConstants.IP_ADDR_DESCRIPTION,
					sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true
				},
				{
					field: 'ip_type', header: CyncConstants.IP_ADDR_IP_TYPE,
					sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true
				},
				{
					field: 'status', header: CyncConstants.IP_ADDR_STATUS,
					sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true
				}
			],
			responseKey: CyncConstants.IP_ADDRESS_SETUP_LIST_RESPONSE_KEY,
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
			menuName: CyncConstants.IP_ADDR_SETUP_MENU_NAME,
			isMoreIconsRequired: false
		};
		this.getPermissions();
		this.getGridData(this.replaceAPIQueryParams(this.gridModel.apiDef.getApi, CyncConstants.DEFAULT_PAGE_NUMBER));
	}

	/**
	 * Method to replace the URL Query parameters
	 * @param url
	 * @param pageCount
	 */
	replaceAPIQueryParams(url: string, pageCount: number): string {
		return url.replace(CyncConstants.SORT_BY_PARAM_VALUE, CyncConstants.DESC_ORDER).
			replace(CyncConstants.ORDER_BY_PARAM_VALUE, CyncConstants.ORDER_BY_UPDATED_AT).
			replace(CyncConstants.PAGE_PARAM_VALUE, pageCount.toString()).
			replace(CyncConstants.ROWS_PARAM_VALUE, CyncConstants.getDefaultRowCount().toString());
	}

	/**
	 * Method to get the grid data
	 * @param url
	 */
	getGridData(url: string) {
		this._ipAddressSetupService.getIpAddressSetupGridData(url).subscribe(response => {
			console.log(':::response----', response);
			this.recordTotal = response.recordTotal;
			this.gridData = response[this.gridModel.responseKey];
			this.getCyncSupportTeamDetails(response);
			this.isDataLoading = true;
			this._message.showLoader(false);
		});
	}

	/**
	 * Method to get the cync support team ip details
	 * @param response
	 */
	getCyncSupportTeamDetails(response: ListIPAddressSetup) {
		this.isShowSupportIps = response.show_support_ips;
		this.supportIps = response.support_ips;
	}

	/**
	 * Call the helper method to get all the menu permissions
	*/
	getPermissions() {
		const userRoleId = localStorage.getItem('cyncUserRoleId'); /* Logged In User*/
		const roleType = localStorage.getItem('cyncUserRole');
		if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
			this._ipAddressSetupService.getMenuPermission(this.gridModel.menuName).subscribe(permissionsResponse => {
				console.log(':::permissionsResponse----', permissionsResponse);
				this.isAddPermitted = this._helper.getAddPermission(permissionsResponse);
				this.isEditPermitted = this._helper.getEditPermission(permissionsResponse);
				this.isDeletePermitted = this._helper.getDeletePermission(permissionsResponse);

			});
		} else {
			this.isAddPermitted = true;
			this.isDeletePermitted = true;
			this.isEditPermitted = true;
		}

	}

	/**
	 * This event gets fired on Global search
	 * @param event
	 */
	onKeyUp(event) {
		if (this.gridModel.searchViaAPI) {
			if (this.searchTerm === CyncConstants.BLANK_STRING) {
				this.toogleCloseBox = false; // hide close icon
				this.toogleSearchBox = true; // Show search icon
			} else {
				this.toogleCloseBox = true; // Show close icon
				this.toogleSearchBox = false; // Hide search icon
			}
			this.showCount = 1;
			this._helper.scrollTopDataTable(this.dataTableElementId);
			this.getGridData(this.appendSearchTerm(this.replaceAPIQueryParams(this.gridModel.apiDef.getApi, this.showCount)));
		}
	}

	/**
	 * Method to append the search term to URL
	 * @param url
	 */
	appendSearchTerm(url: string): string {
		return url + this.searchTerm;
	}

	/**
	 * On click of close Icon this event gets fired to clear the global search
	*/
	clearSearchBox() {
		this._message.showLoader(true);
		this.isDataLoading = false;
		this.searchTerm = CyncConstants.BLANK_STRING;
		this.getGridData(this.replaceAPIQueryParams(this.gridModel.apiDef.getApi, CyncConstants.DEFAULT_PAGE_NUMBER));
		this.toogleCloseBox = false;
		this.toogleSearchBox = true;
		this.recordCount = -1;
		// reinitialize page count
		this.showCount = 1;
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
		if (this.selectedRows.length === 1) {
			this._router.navigateByUrl(this._router.url + '/' + this.selectedRows[0].id);
		}
	}

	/**
	 * On click of grid row route to edit page
	 * @param event
	 */
	goToView(event: any) {
		if (event.type === CyncConstants.CHECKBOX_EVENT_TYPE) {
			this.updateGridIcons();
		} else if (event.type === CyncConstants.ROW_EVENT_TYPE && this.isEditPermitted) {
			this.selectedRows = [];
			const rowId = event.data.id;
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
			this.toggleEditIcon = this.selectedRows !== undefined && this.selectedRows.length === 1;
		}
	}

	/**
	 * Update delete icon
	 */
	updateDeleteIcon() {
		if (this.isDeletePermitted) {
			this.toggleDeleteIcon = this.selectedRows !== undefined && this.selectedRows.length > 0;
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
		// console.log(":::printFilteredData");
		if (event.filteredValue !== undefined) {
			this.recordCount = event.filteredValue.length;
			if (this.recordCount === this.gridData.length) {
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
		// console.log("::selectedRows----", this.selectedRows);
		this._helper.openConfirmPopup({
			'title': CyncConstants.CONFIRMATION_POPUP_TITLE,
			'message': this._ipAddressSetupService.getConfirmationPopupMessage(this.selectedRows, 'name'),
			'msgType': 'warning'
		}).subscribe(result => {
			if (result) {
				// console.log('user has clicked on yes');
				this._message.showLoader(true);
				this.deleteSelectedRecords();
			} else {
				// console.log('user has clicked on cancel');
				// unselect all the checkbox
				this.selectedRows = [];
				this.updateGridIcons();
			}
		});
	}

	/**
 	* Call the API to delete selected records
 	*/
	deleteSelectedRecords() {
		const apiEndpoint: string = this.appendRecordIds(this.gridModel.apiDef.deleteApi);
		// console.log(':::apiEndpoint---', apiEndpoint);
		this._ipAddressSetupService.deleteIpAddressSetup(apiEndpoint).subscribe(deleteResponse => {
			// console.log("::deleteResponse----", deleteResponse);
			if (deleteResponse.status === CyncConstants.STATUS_204 || deleteResponse.status === CyncConstants.STATUS_200) {
				// this._message.showLoader(false);
				// show success message after deleting records
				this.fireSuccessMsg(CyncConstants.DELETE_SUCCESS_MSG);
				// reload grid data after successful deletion
				this.getGridData(this.replaceAPIQueryParams(this.gridModel.apiDef.getApi, CyncConstants.DEFAULT_PAGE_NUMBER));
				// unselect all the checkbox and update the grid icons
				this.selectedRows = [];
				this.updateGridIcons();

			}
		});
	}

	/**
	 * Append URL Parameters
	 * @param url
	 */
	appendRecordIds(url: string): string {
		return url + this._helper.getRecordNamesOrRecordIds(this.selectedRows, 'id');
	}

	/**
	 * Show Success Message
	 * @param successMsg
	 */
	fireSuccessMsg(successMsg: string) {
		this._helper.showApiMessages(successMsg, CyncConstants.SUCCESS_CSS);
	}

	// Export code starts

	/**
	 * Show pop up for export with column selection
	 */
	showDialogForExport() {
		this.toogleExportConfirmPoupupFlag();
		this.exportColumns = [];
		this.exportColumns = this._helper.getExportColumns(this.gridModel.columnDef);
	}

	/**
	 * Method to hide or show the export popup
	 */
	toogleExportConfirmPoupupFlag() {
		this.toogleExportConfirmPoupup = !(this.toogleExportConfirmPoupup);
	}

	/**
	 * Call the API to export the selected columns
	 * @param selectedColumns
	 */
	exportSelectedColumns(selectedColumns: ExportColumn[]) {
		// console.log("::selectedColumns---", selectedColumns);
		let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
		if (queryParam !== undefined && queryParam.length > 0) {
			// since export api expects 'active' key as column name, replacing status to active
			queryParam = queryParam.replace('status', 'active');
			// set the apiendpoint
			const apiEndpoint = this.gridModel.apiDef.exportApi;
			// hide the export popup
			this.toogleExportConfirmPoupupFlag();
			this._message.showLoader(true);
			this._ipAddressSetupService.exportData(queryParam, apiEndpoint).subscribe(blob => {
				// console.log('::export successful');
				// unselect all checkboxes
				this.selectedRows = [];
				// empty all  columns in the popup
				this.exportColumns = [];
				// update grid icons
				this.updateGridIcons();
				// download the xls file
				this._helper.downloadFile(blob, this.gridModel.type);
				this._message.showLoader(false);
			});
		} else {
			// If all the columns are unchecked show warning msg to select atleast one column
			this.toogleExportConfirmPoupup = true;
			this.isExportWarningPopupVisible = true;
		}
	}

	// Export code ends

	/**
	 * On Scroll load grid data
	*/
	onScroll(event) {
		// console.log(":::on scroll");
		// call helper method to fix the table header
		this._helper.fixTableHeader(event.target, this.gridModel.isAdvanceSearchAvailable);
		if (this._helper.isScollbarAtBottom(this.dataTableElementId)) { 
			this.load_more = true;

		} else {
			this.load_more = false;
		}
		let endpoint: string = this.gridModel.apiDef.getApi;
		// console.log(":::this.load_more",this.load_more);
		// console.log(":::height_pre",height_pre);
		// console.log(":::height_client",height_client);
		// console.log(":::scroll_top",scroll_top);
		if (this.load_more && this.gridData.length < this.recordTotal) {
			this.showCount = this.showCount + 1;
			endpoint = this.replaceAPIQueryParams(endpoint, this.showCount);
			if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
				this.showSpinner = true;
			}
			if (this.searchTerm.length > 0) {
				endpoint = this.appendSearchTerm(endpoint);
			}
			this._ipAddressSetupService.getIpAddressSetupGridData(endpoint).subscribe(apiResponse => {
				this.gridData = this.gridData.concat(apiResponse[this.gridModel.responseKey]);
				this.showSpinner = false;
			});
		}
	}

}
