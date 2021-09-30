import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClientTransactionService } from '../service/client-transaction-service';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Observable } from 'rxjs/Observable';
import { AblClientTransactionDetail, ListAblClientTransactionApiResponse, ClientTransactionTotalDetail } from '../model/client-transaction.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ExportColumn } from '@app/shared/models/export-columns.model';

@Component({
  selector: 'list-client-transaction',
  templateUrl: './list-client-transaction.component.html',
})

/**
 * @author Raushan
 */
export class ListClientTransactionComponent implements OnInit {

  gridData: AblClientTransactionDetail[] = [];
  totalClientTransactionDetail: ClientTransactionTotalDetail;
  clientTransactionModel: CustomGridModel;
  toogleSearchBox: boolean;
  toogleCloseBox: boolean;
  toggleEditIcon: boolean;
  toggleDeleteIcon: boolean;
  rowCount: number = CyncConstants.getDefaultRowCount();
  isAddPermitted: boolean;
  isEditPermitted: boolean;
  isDeletePermitted: boolean;
  recordTotal: number;
  showTotalrecords: number = 0;
  showCount: number = 1;
  isDataLoading: boolean;
  //show loader while getting data on scroll event
  showSpinner: boolean;
  searchTerm: string = CyncConstants.BLANK_STRING;
  searchPageCount: number = 1;
  dataTableElementId: string = CyncConstants.DATA_TABLE_ID;
  recordCount: number = -1;
  selectedRows: any[] = [];
  exportColumns: ExportColumn[] = [];
  toogleExportConfirmPoupup: boolean;
  isExportWarningPopupVisible: boolean;
  load_more: boolean;


  constructor(private _clientTransactionService: ClientTransactionService,
    private _message: MessageServices,
    private _helper: Helper,
    private _apiMapper: APIMapper,
    private _router: Router,
  ) { }

  ngOnInit() {
    this.toogleSearchBox = true; // Show search icon on page load
    this.toogleCloseBox = false; // hide close icon on page load
    this._helper.adjustUI();
    this.initializeGrid();
  }

  initializeGrid() {
    this._message.showLoader(true);
    this.getPermissions();
    this.clientTransactionModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_CLIENT_TRANSACTION_FOR_ABL], deleteApi: '', updateApi: '' },
      type: CyncConstants.GET_CLIENT_TYPE_FOR_ABL,
      columnDef: [
        { field: 'client_name', header: 'Client Name', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'manager_name', header: 'Manager', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'last_bbc_date', header: 'Last BBC Date', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'utilization', header: 'Utilization', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'avg_monthly_loan_balance_amount', header: 'Avg. Monthly Loan Balance', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'credit_line', header: 'Credit Line', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'collateral_value', header: 'Collateral Value', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'current_balance', header: 'Current Balance', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'available_to_loan', header: 'Available to Loan', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'letter_of_credit', header: 'Letter of Credit', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true }
      ],
      responseKey: CyncConstants.CLIENT_TRANSACTION_SUMMARY_RESPONSE_KEY,
      isSearchAvailable: true,
      isAdvanceSearchAvailable: false,
      isAddFunctionalityRequired: false,
      isEditFunctionalityRequired: false,
      isDeleteFunctionalityRequired: false,
      isExportFunctionalityRequired: true,
      isReloadFunctionalityRequired: false,
      onlyListingComponent: false,
      showTotalRecords: true,
      searchViaAPI: false,
      menuName: CyncConstants.GET_CLIENT_TYPE_FOR_ABL,
      isMoreIconsRequired: false
    };
    this.getGridData(this.replaceApiQueryParams(this.clientTransactionModel.apiDef.getApi, this.showCount), this._apiMapper.endpoints[CyncConstants.GET_TOTAL_CLIENT_TRANSACTION_DETAIL]);
  }

  /** 
	 * Call the helper method through service to get all the menu permissions
	 */
  getPermissions() {
    this._clientTransactionService.getMenuPermission().subscribe(permissionsResponse => {
      this.isAddPermitted = this._clientTransactionService.getAddPermission(permissionsResponse);
      this.isEditPermitted = this._clientTransactionService.getEditPermission(permissionsResponse);
      this.isDeletePermitted = this._clientTransactionService.getDeletePermissions(permissionsResponse);

    });
  }

  /**
	 * Replace api query params
	 * @param url 
	 * @param pageNum 
	 */
  replaceApiQueryParams(url: string, pageNum: number): string {
    return this._clientTransactionService.replaceQueryParams(url, pageNum, this.rowCount);
  }

  /**
	 * Call the api to get all Grid data
	 * @param url 
	 */
  getGridData(url: string, apiEndPoints: string) {
    this._clientTransactionService.getGridData(url).subscribe(apiResponse => {
      if (apiResponse.recordTotal != undefined) {
        this.recordTotal = apiResponse.recordTotal;
        this.showTotalrecords = this.recordTotal;
      }
      this.gridData = apiResponse[this.clientTransactionModel.responseKey];
      this.getTotalClientTransaction(apiEndPoints);
    });
  }

  /**
   * call the api to get total client transaction details
   * @param apiEndPoint 
   */
  getTotalClientTransaction(apiEndPoint: string) {
    this._clientTransactionService.getClientTransactionData(apiEndPoint).subscribe(apiRes => {
      this.totalClientTransactionDetail = apiRes;
      this.isDataLoading = true;
      this._message.showLoader(false);
    });
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
      this.getGridData(this.replaceApiQueryParams(this.clientTransactionModel.apiDef.getApi, this.showCount), this._apiMapper.endpoints[CyncConstants.GET_TOTAL_CLIENT_TRANSACTION_DETAIL]);
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
    let endpoint = this.replaceApiQueryParams(this.clientTransactionModel.apiDef.getApi, this.searchPageCount);
    endpoint = endpoint + '&search=' + searchTerm;
    let apiEndPoint = this._apiMapper.endpoints[CyncConstants.GET_TOTAL_CLIENT_TRANSACTION_DETAIL];
    apiEndPoint = apiEndPoint + '?search=' + searchTerm;
    this.getGridData(endpoint, apiEndPoint);
  }

  /**
	 * On click of close icon this event gets fired
	 */
  clearSearchBox() {
    this.searchTerm = CyncConstants.BLANK_STRING;
    this.toogleCloseBox = false;
    this.toogleSearchBox = true;
    this.recordCount = -1;
    //reinitialize page count
    this.showCount = 1;
    //reinitialize search page count
    this.searchPageCount = 1;
    //reload grid data
    this.getGridData(this.replaceApiQueryParams(this.clientTransactionModel.apiDef.getApi, this.showCount), this._apiMapper.endpoints[CyncConstants.GET_TOTAL_CLIENT_TRANSACTION_DETAIL]);
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
    } else if (event.type == CyncConstants.ROW_EVENT_TYPE) {
      this.selectedRows = [];
      let rowId = event.data.id;
      this._router.navigateByUrl(this._router.url + '/view/' + rowId);
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
	 * On click of delete icon show pop up
	 */
  delete() {

  }

	/**
	 * Show pop up for export with column selection
	 */
  showDialogForExport() {
    this.toogleExportConfirmPoupupFlag();
    this.exportColumns = [];
    this.exportColumns = this._helper.getExportColumns(this.clientTransactionModel.columnDef);
  }

  /** 
   * This method for getting dialog box visible or not
   */
  toogleExportConfirmPoupupFlag() {
    this.toogleExportConfirmPoupup = !(this.toogleExportConfirmPoupup);
  }

  /**
   * This method for export data based on column selection from dialog box
   * @param selectedColumns
   */
  exportSelectedColumns(selectedColumns: ExportColumn[]) {
    let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
    if (queryParam != undefined && queryParam.length > 0) {
      //set the apiendpoint
      let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_CLIENT_TRANSACTION];
      //hide the export popup
      this.toogleExportConfirmPoupupFlag();
      this._message.showLoader(true);
      this._clientTransactionService.exportData(queryParam, apiEndpoint).subscribe(blob => {
        //unselect all checkboxes
        this.selectedRows = [];
        //empty all  columns in the popup
        this.exportColumns = [];
        //update grid icons
        this.updateGridIcons();
        //download the xls file
        this._helper.downloadFile(blob, this.clientTransactionModel.type);
        this._message.showLoader(false);
      });
    } else {
      //If all the columns are unchecked show warning msg to select atleast one column
      this.toogleExportConfirmPoupup = true;
      this.isExportWarningPopupVisible = true;
    }
  }

  /** 
	 * On Scroll load grid data
   * @param event
	 */
  onScroll(event) {
    //call helper method to fix the table header
    this._helper.fixTableHeader(event.target, this.clientTransactionModel.isAdvanceSearchAvailable);
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
      if (this.searchTerm.length > 0) {
        this.searchPageCount = this.searchPageCount + 1;
        endpoint = this.replaceApiQueryParams(this.clientTransactionModel.apiDef.getApi, this.searchPageCount);
        endpoint = endpoint + '&search=' + this.searchTerm;
      } else {
        endpoint = this.replaceApiQueryParams(this.clientTransactionModel.apiDef.getApi, this.showCount);
      }
      this._clientTransactionService.getGridData(endpoint).subscribe(apiResponse => {
        this.gridData = this.gridData.concat(apiResponse[this.clientTransactionModel.responseKey]);
        this.showSpinner = false;
      });
    }
  }
}