import { Component, OnInit, OnDestroy } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { ActivatedRoute, Router } from '@angular/router';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { Helper } from '@cyncCommon/utils/helper';
import { CustomRatiosService } from '../service/custom-ratios.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

@Component({
	selector: 'addedFormulaList',
	templateUrl: './list-formula.component.html',
	styleUrls: ['./list-formula.component.scss']
})
export class ListFormulaComponent implements OnInit {

	private subject = new Subject<any>();

	assetsPath: string = CyncConstants.getAssetsPath();
	disableField: boolean;
	selectedItem: any;
	addOrEdit: string;
	dataTableElementId: string = 'custom_ratios';
	listRatiosModel: CustomGridModel;
	projectID: string = this.getProjectID();
	borrowerId: string;

	//Grid Variables
	globalSearchIcon: boolean = true;
	globalSearchCloseIcon: boolean = false;
	searchTerm: string = '';
	gridData: any = [];
	loadCount = 0;
	pageNumber = CyncConstants.PAGE_NUMBER;
	rowcount = CyncConstants.getDefaultRowCount();
	showmoreData: any = [];
	isAddPermitted: boolean;
	isEditPermitted: boolean;
	isDeletePermitted: boolean;
	recordTotal: number;
	selectedRows: any = [];
	toggleDeleteIcon: boolean;
	toggleEditIcon: boolean;
	toggleExportModal: boolean;
	toggleExportErrorModal: boolean;
	exportHeaderArray: any;
	exportRowArray: any;
	isGridDataLoaded: boolean = false;
	direction = 'DESC';
	sortBy = 'lastModifiedDate';
	filterRecordCount: number = -1;
	isChecked: any;
	//show loader on scroll event
	showSpinner: boolean;
	currentAction: string = CyncConstants.GET_ADD_ACTION //GET_EDIT_ACTION
	get_api: string = '';

	constructor(
		private _msgLoader: MessageServices,
		private _apiMapper: APIMapper,
		private route: ActivatedRoute,
		private _router: Router,
		private _helper: Helper,
		private _customRatiosService: CustomRatiosService
	) {
		this.borrowerId = CyncConstants.getSelectedClient();
	}

	ngOnInit() {
		this.subject.next({ currentAction: CyncConstants.GET_ADD_ACTION });
		this._msgLoader.showLoader(true);
		this.get_api = this._apiMapper.endpoints[CyncConstants.GET_CUSTOM_FINANCIAL_RATIOS]
			.replace('{clientId}', this.borrowerId)
			.replace('{sortByValue}', this.sortBy)
			.replace('{orderByValue}', this.direction)
			.replace('{pageNumValue}', this.pageNumber.toString())
			.replace('{numOfRowsValue}', this.rowcount.toString())
			.replace('{searchValue}', this.searchTerm);
		const _delete_api = this._apiMapper.endpoints[CyncConstants.DELETE_CUSTOM_FINANCIAL_RATIOS].replace('{clientId}', this.borrowerId);

		this.listRatiosModel = {

			//Need To Work on This :)


			//Change key name for Posting Type once API is ready
			//Also in API Mapper the search api is not working
			infiniteScroll: true,
			multiSelection: false,
			onDemandLoad: true,
			singleSelection: false,
			type: 'Added Custom Ratios',
			apiDef: { getApi: this.get_api, deleteApi: _delete_api, updateApi: '' },
			columnDef: [
				{ field: 'ratio.name', header: 'Ratio Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'formulaName', header: 'Custom Ratio', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
				{ field: 'id', header: 'id', sortable: true, isTemplate: false, templateHtml: '', hidden: true, filter: true }

			],
			responseKey: 'data',
			isSearchAvailable: true,
			isAdvanceSearchAvailable: false,
			isAddFunctionalityRequired: true,
			isEditFunctionalityRequired: true,
			isDeleteFunctionalityRequired: true,
			isExportFunctionalityRequired: false,
			isReloadFunctionalityRequired: false,
			onlyListingComponent: false,
			showTotalRecords: true,
			searchViaAPI: true,
			menuName: 'financial_analyzer',
			permissionRequired: true,
			isMoreIconsRequired: false
		}
		this.loadGridData();
	}


	/**
	 * Method to get the list of Added ratios from Service and display in the data table
	 */
	loadGridData() {
		let urlEndPoint = this._apiMapper.endpoints[CyncConstants.GET_CUSTOM_FINANCIAL_RATIOS]
			.replace('{clientId}', this.borrowerId)
			.replace('{sortByValue}', this.sortBy)
			.replace('{orderByValue}', this.direction)
			.replace('{pageNumValue}', this.pageNumber.toString())
			.replace('{numOfRowsValue}', this.rowcount.toString())
			.replace('{searchValue}', this.searchTerm);
		this._customRatiosService.getCustomFormulas(urlEndPoint).subscribe(response => {
			this.gridData = response[this.listRatiosModel.responseKey];
			this.recordTotal = response.recordTotal;
			this.updateGridIcons();
		})
	}

	/**
	 * Reload Grid Data
	 */
	reloadGridData() {
		this.loadGridData();
	}

	/**
	 * Method to navigate back to FA list
	 */
	navigateToFAList() {
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
	}

	backToSetup() {
		this._router.navigate(['/financial/financial-ratio/' + this.projectID]);
	}

	/**
	* Method gets called when all the checkboxes are checked
   	*/
	selectAllChkBox() {
		this.updateGridIcons();
	}

	/**
	 * Method when we uncheck a checkbox
	 */
	unSelectChkBox() {
		this.updateGridIcons();
	}

	/**
   * Method to update add/edit icons
   */
	updateGridIcons() {
		this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
		this.toggleEditIcon = this.selectedRows != undefined && this.selectedRows.length == 1;
	}

	/**
   * This method gets called on click of Add Icon
   */
	goToAdd() {
		//Need To Work on This :)
		this.subject.next({ currentAction: CyncConstants.GET_ADD_ACTION });
	}

	/**
	 * This method will return the current action, Add/ Edit
	 */
	getCurrentAction(): Observable<any> {
		return this.subject.asObservable();
	}

	/**
   *
   * @param selectedRow
   */
	goToView(selectedRow: any) {
		this.updateGridIcons();
	}

	/**
	 * Method that gets called for global search
	 * @param event
	 */

	onKey(event: any) {

		//Need To Work on This :)
		if (this.searchTerm == CyncConstants.BLANK_STRING || this.searchTerm == undefined || this.searchTerm == null) {
			this.searchTerm = '';
			this.globalSearchCloseIcon = false;
			this.globalSearchIcon = true;
			setTimeout(() => {
				this.loadGridData();
			}, 100);
		}
		else {
			this.globalSearchCloseIcon = true;
			this.globalSearchIcon = false;
			setTimeout(() => {
				this.loadGridData();
			}, 100);

		}
	}

	/**
	 * Method to clear the global search
	 */
	clearSearchBox() {
		this._helper.scrollTopDataTable(this.dataTableElementId);
		this.selectedRows = [];
		this.searchTerm = '';
		this.globalSearchCloseIcon = false;
		this.globalSearchIcon = true;
		this.filterRecordCount = -1;
		this.pageNumber = 0;
		setTimeout(() => {
			this.loadGridData();
		}, 100);
	}


	/**
	 * Method when edit icon is clicked
	 * @param event
	 */
	goToEdit() {
		if (this.selectedRows !== undefined && this.selectedRows.length == 1) {
			this.subject.next({ currentAction: CyncConstants.GET_EDIT_ACTION, selectedID: this.selectedRows[0].id });

		}
	}

	/**
	 * Method when delete icon is clicked
	 */
	delete() {
		// Need to work on this

		let idsToBeDeleted = [];
		let descForSelectedIds = [];
		for (let ids of this.selectedRows) {
			idsToBeDeleted.push(ids.id);
			descForSelectedIds.push(ids.formulaName)
		}
		const popMessage = CyncConstants.IR_SINGLE_MSG.replace(CyncConstants.SELECTED_RECORD_NAMES, descForSelectedIds.join(','));
		const popupParam = { 'title': 'Confirmation', 'message': popMessage, 'msgType': 'warning' };
		this._helper.openConfirmPopup(popupParam).subscribe(confirm => {
			if (confirm) {
				this._msgLoader.showLoader(true);
				this._customRatiosService.deleteCustomFormula(this.listRatiosModel.apiDef.deleteApi, idsToBeDeleted).subscribe(response => {
					if (response.status === CyncConstants.STATUS_204) {
						this.loadGridData();
						this._helper.showApiMessages('The selected formula has been deleted successfully', 'success');

					}
				})

				//unselect all checkbox      
				this.selectedRows = [];
				this.updateGridIcons();
				this.loadGridData();
				this._msgLoader.showLoader(false);

			} else {
				//unselect all checkbox
				this.selectedRows = [];
				this.updateGridIcons();
			}
		});
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
  * This method will get the ProjectID From URL
  */
	getProjectID(): string {
		let projID = '';
		this.route.params.subscribe(params => {
			projID = params['id'];
			this.projectID = params['id'];
		});
		return projID;
	}

	/**
	* Method that gets called on scroll
	*/
	onScroll(event) {
		//fix datatable header
		this._helper.fixTableHeader(event.target, this.listRatiosModel.isAdvanceSearchAvailable);
		const target = document.getElementById('innerContainer');
		const height_pre = target.scrollHeight;
		const height_client = target.clientHeight;
		const scroll_top = target.scrollTop;
		let load_more: boolean;
		if (scroll_top == (height_pre - height_client)) { load_more = true; } else { load_more = false; }
		if (load_more == true && (this.gridData.length < this.recordTotal)) {

			if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
				this.showSpinner = true;
			}
			this.pageNumber = this.pageNumber + 1;
			this.showSpinner = false;
			this.reloadGridData();
			load_more = false;
		}
	}
}