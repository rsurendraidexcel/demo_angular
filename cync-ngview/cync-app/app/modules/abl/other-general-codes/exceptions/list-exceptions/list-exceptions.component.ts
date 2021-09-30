import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from "@angular/router";
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { ExceptionService } from '../service/exceptions.service';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ExceptionListApiResponseModel } from '../model/exceptions.model';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { OpenPoupService } from '@app/shared/services/open-popups.service';
import { AdvanceSearch, Filters, FilterRules, FiltersModel } from '@app/shared/components/advance-search-popup/advance-search-popup.model';
import { AdvanceSearchPoupService } from '@app/shared/components/advance-search-popup/advance-search-popup.service';

@Component({
    selector: 'exception',
    templateUrl: './list-exceptions.component.html'
})

/**
 * @author: Nagendra Kumar
 */

export class ListExceptionsComponent {
    advanceSearchModel: FiltersModel;
    exceptionModel: CustomGridModel;
    exceptionDetailsResponse: ExceptionListApiResponseModel;
    //Grid Variables
    globalSearchIcon: boolean = true;
    globalSearchCloseIcon: boolean = false;
    searchTerm: string = "";
    gridData: any = [];
    pageNumber = CyncConstants.DEFAULT_PAGE_NUMBER;
    rowCount: number = CyncConstants.getDefaultRowCount();
    isAddPermitted: boolean;
    isEditPermitted: boolean;
    isDeletePermitted: boolean;
    recordTotal: number;
    selectedRows: Array<any> = [];
    toggleDeleteIcon: boolean;
    toggleEditIcon: boolean;
    toggleExportModal: boolean;
    toggleExportErrorModal: boolean;
    exportHeaderArray: any;
    exportRowArray: any;
    isGridDataLoaded: boolean = false;
    sortByColumn: string = 'code';
    sortOrder: string = 'desc';
    filterRecordCount: number = -1;
    showSpinner: boolean;
    // array to display the export columns
    exportColumns: ExportColumn[] = [];
    searchPageCount: number = 1;
    dataTableElementId: string = 'cync_main_contents';
    persistAdvanceSearch: any = [];

    /**
     * 
     * @param _exceptionService 
     * @param _messageService 
     * @param _helper 
     * @param _router 
     * @param _commonAPIs 
     * @param _apiMapper 
     */
    constructor(private _exceptionService: ExceptionService,
        private _messageService: MessageServices,
        private _helper: Helper,
        private _router: Router,
        private _commonAPIs: CommonAPIs,
        private _advanceSearchPopupService: AdvanceSearchPoupService,
        private _popupService: OpenPoupService,
        private _apiMapper: APIMapper) {
    }

    /**
	 * Initialize the grid model for Exception
	 */
    ngOnInit() {
        this._helper.adjustUI();
        this.formGridModel();
    }

    /**
     * This method to form model for exceptions
     */
    formGridModel() {
        this.exceptionModel = {
            infiniteScroll: true,
            multiSelection: true,
            onDemandLoad: true,
            singleSelection: false,
            type: CyncConstants.GET_EXCEPTION_TYPE,
            apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_EXCEPTIONS_LIST], deleteApi: this._apiMapper.endpoints[CyncConstants.DELETE_LENDER_EXCEPTIONS], updateApi: '' },
            columnDef: [
                { field: 'display_label', header: 'Exception Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'description', header: 'Exception Note', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'operator', header: 'Exception Sign', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'value_type_name', header: 'Value Type', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'exception_value', header: 'Exception Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'system_defined_str', header: 'System', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
                { field: 'add_to_all_clients', header: 'Auto All Clients', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: false }
            ],
            responseKey: 'lender_exception',
            isSearchAvailable: true,
            isAdvanceSearchAvailable: false,
            isAddFunctionalityRequired: true,
            isEditFunctionalityRequired: true,
            isDeleteFunctionalityRequired: true,
            isExportFunctionalityRequired: true,
            isReloadFunctionalityRequired: false,
            isMoreIconsRequired: false,
            onlyListingComponent: false,
            showTotalRecords: true,
            searchViaAPI: true,
            menuName: 'lender_exception'
        };

        this.getPermissions();
    }


    /**
	 * Get Permissions for Exception
	 */
    getPermissions() {
        let userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);/*Logged In User*/
        let userRoleType = localStorage.getItem(CyncConstants.CYNC_USER_ROLE);
        if (!this._helper.compareIgnoreCase(userRoleType, CyncConstants.ADMIN_ROLE_TYPE)) {
            this._commonAPIs.getUserPermission(this.exceptionModel.menuName, userRoleId).subscribe(permissions => {
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
        this._messageService.showLoader(true);
        let url = this.getExcetionAPIUrl(this.exceptionModel.apiDef.getApi);
        this._exceptionService.getExceptionList(url).subscribe(apiResponse => {
            this.recordTotal = apiResponse.recordTotal;
            this.gridData = apiResponse[this.exceptionModel.responseKey];
            this.isGridDataLoaded = true;
            this._messageService.showLoader(false);
        });

    }

    /**
	 * Method that gets called for global search
	 * @param event 
	 */
    onKey(event: any) {
        if (event.target.value == '') {
            this.globalSearchCloseIcon = false;
            this.globalSearchIcon = true;
        }
        else {
            this.exceptionModel.isAdvanceSearchAvailable = false;
            this.globalSearchCloseIcon = true;
            this.globalSearchIcon = false;
        }
        /* if (event.target.value == undefined) {
             event.target.value = '';
             this.globalSearchCloseIcon = false;
             this.globalSearchIcon = true;
         }*/

        if (this.exceptionModel.searchViaAPI) {
            this.searchTerm = event.target.value;
            //Make entry for search api
            this.pageNumber = 1;
            this._helper.scrollTopDataTable(this.dataTableElementId);
            this._exceptionService.getExceptionList(this.appendSearchTerm(this.exceptionModel.apiDef.getApi, this.searchTerm)).subscribe(exceptionData => {
                this.gridData = exceptionData[this.exceptionModel.responseKey];
                this.recordTotal = exceptionData.recordTotal;
            });
        }
    }

    /**
         * This method appends the search Term
         * @param url 
         * @param searchTerm 
         */
    appendSearchTerm(url: string, searchTerm: string): string {
        url = this.getExcetionAPIUrl(url);
        if (!(searchTerm != null && searchTerm != undefined && searchTerm.length > 0)) {
            searchTerm = '';
        }
        url = url + searchTerm;
        return url;
    }

    /**
    * This method replaces the request params with original value
    * @param url 
    */
    getExcetionAPISearchUrl(url: string) {
        return url.replace('{order_by}', this.sortByColumn).replace('{sort_by}', this.sortOrder).replace('{page}', this.searchPageCount.toString()).replace('{rows}', this.rowCount.toString());
    }

    /**
	 * This method replaces the request params with original value
	 * @param url 
	 */
    getExcetionAPIUrl(url: string) {
        return url.replace('{order_by}', this.sortByColumn).replace('{sort_by}', this.sortOrder).replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowCount.toString());
    }

    /**
	 * Method that gets called on scroll
	 */
    onScroll(event) {
        let load_more: boolean = false;
        this._helper.fixTableHeader(event.target, this.exceptionModel.isAdvanceSearchAvailable);
        if (this._helper.isScollbarAtBottom(this.dataTableElementId)) {
            load_more = true;
        } else {
            load_more = false;
        }

        if (load_more == true && this.gridData.length < this.recordTotal) {
            this.pageNumber = this.pageNumber + 1;
            if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
                this.showSpinner = true;
            }
            if (this.exceptionModel.isAdvanceSearchAvailable) {
                let filterEndPoint = this._apiMapper.endpoints[CyncConstants.GET_SEARCH_DATA];
                filterEndPoint = filterEndPoint.replace('{model}', 'lender_exceptions').replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowCount.toString());
                this._advanceSearchPopupService.getAdvanceSearchData(filterEndPoint, this.advanceSearchModel).subscribe(res => {
                    let apiResponce = JSON.parse(res._body);
                    this.gridData = this.gridData.concat(apiResponce[this.exceptionModel.responseKey]);
                    this.showSpinner = false;
                });
            } else {
                let url = '';
                if (this.searchTerm.length > 0) {
                    this.searchPageCount = this.searchPageCount + 1;
                    url = this.getExcetionAPISearchUrl(this.exceptionModel.apiDef.getApi);
                } else {
                    url = this.getExcetionAPIUrl(this.exceptionModel.apiDef.getApi);
                }
                this._exceptionService.getExceptionList(this.appendSearchTerm(url, this.searchTerm)).subscribe(exceptionList => {
                    this.gridData = this.gridData.concat(exceptionList[this.exceptionModel.responseKey]);
                    this.showSpinner = false;
                });
            }

        }
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
        this._messageService.showLoader(true);
        let deleteEndpoint = this.exceptionModel.apiDef.deleteApi + '?ids=' + idsToBeDeleted;
        this._exceptionService.deleteException(deleteEndpoint).subscribe(response => {
            this._helper.showApiMessages(CyncConstants.DELETE_MESSAGE, 'success');
            this.selectedRows = [];
            this.pageNumber = CyncConstants.DEFAULT_PAGE_NUMBER;
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
        if (this.isEditPermitted) {
            let event: any = selectedRow.originalEvent;
            if (selectedRow.type == 'checkbox') {
                this.updateGridIcons();
            } else if (selectedRow.type == 'row') {
                this.selectedRows = [];
                let rowId = selectedRow.data.id;
                this._router.navigateByUrl(this._router.url + "/" + rowId);
            }
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
        this.exportColumns = this._helper.getExportColumns(this.exceptionModel.columnDef);
        this.toggleExportModal = true;
    }

    /* This method gets called to export the columns
    * @param exportedCol 
    */
    exportSelectedColumns(selectedColumns: ExportColumn[]) {
        let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
        if (queryParam != undefined && queryParam.length > 0) {
            queryParam = queryParam.replace("system_defined_str", "system_defined"); // specific to this module thats why
            //hide the export popup
            this.toggleExportModal = false;
            this._messageService.showLoader(true);
            this._exceptionService.exportException(this.exceptionModel.apiDef.getApi.split('?')[0], queryParam).subscribe(blob => {
                //unselect all checkboxes
                this.selectedRows = [];
                //empty all columns in the popup
                this.exportColumns = [];
                //download the xls file
                this.updateGridIcons();
                this._helper.downloadFile(blob, this.exceptionModel.type);
                this._messageService.showLoader(false);
            });
        } else {
            //If all the columns are unchecked show warning msg to select atleast one column
            this.toggleExportErrorModal = true;
            this.toggleExportModal = true;
        }

    }

	/**
	 * Method to clear the global search
	 */
    clearSearchBox() {
        this.getGridData();
        this.searchTerm = '';
        this.globalSearchCloseIcon = false;
        this.globalSearchIcon = true;
        this.filterRecordCount = -1;
        this.pageNumber = 1;
    }

    /**
   * Open advance search popup
   */

    openAdvanceSearchPoup() {
        this._helper.scrollTopDataTable(this.dataTableElementId);
        let getColumnEndPoint = this._apiMapper.endpoints[CyncConstants.GET_COLUMNS];
        getColumnEndPoint = getColumnEndPoint.replace('{model}', 'LenderException');

        let getOperatorEndPoint = this._apiMapper.endpoints[CyncConstants.GET_OPERATORS];

        let getDropdownEndPoint = this._apiMapper.endpoints[CyncConstants.GET_DROPDOWN_VALUES];
        getDropdownEndPoint = getDropdownEndPoint.replace('{model}', 'LenderException');

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
        this._messageService.showLoader(true);
        this.exceptionModel.isAdvanceSearchAvailable = true;
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
        filterEndPoint = filterEndPoint.replace('{model}', 'lender_exceptions').replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowCount.toString());
        this._advanceSearchPopupService.getAdvanceSearchData(filterEndPoint, requestBody).subscribe(res => {
            let apiResponce = JSON.parse(res._body);
            this.gridData = apiResponce[this.exceptionModel.responseKey];
            this.recordTotal = apiResponce.recordTotal;
            this._messageService.showLoader(false);
        });
    }

}