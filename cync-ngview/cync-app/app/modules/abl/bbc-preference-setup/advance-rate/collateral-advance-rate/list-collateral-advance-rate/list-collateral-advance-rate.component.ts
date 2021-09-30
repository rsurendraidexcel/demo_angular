import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { CustomGridModel, ColumnDefinition } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { CollateralAdvanceRateService } from '../service/collateral-advance-rate.service';
import { ListDivisions, Division, ListCollateralAdvanceRate, CollateralAdvanceRates } from '../model/collateral-advance-rate.model';

@Component({
  selector: 'app-list-collateral-advance-rate',
  templateUrl: './list-collateral-advance-rate.component.html',
  styleUrls: ['./list-collateral-advance-rate.component.scss']
})
export class ListCollateralAdvanceRateComponent implements OnInit {

  // --------------------------------- Collateral Division Grid variables---------------------------------
  collateralDivisionGridModel: CustomGridModel;
  toogleSearchBox1: boolean;
  toogleCloseBox1: boolean;
  searchTerm1: string = CyncConstants.BLANK_STRING;
  gridData1: Division[] = [];
  @ViewChild(DataTable) dataTableComponent: DataTable;
  toggleEditIcon1: boolean;
  toggleDeleteIcon1: boolean;
  toggleReloadIcon1: boolean;
  isDataLoading1: boolean;
  recordCount1: number = -1;
  recordTotal1: number;
  showTotalrecords1: number = 0;
  loadCount1: number = 0;
  load_more1: boolean;
  showCount1: number = 1;
  rowCount1: number = CyncConstants.getDefaultRowCount();
  selectedRows1: any[] = [];
  // array to display the export columns
  exportColumns1: ExportColumn[] = [];
  toogleExportConfirmPoupup1: boolean;
  isExportWarningPopupVisible1: boolean;
  searchPageCount1: number = 1;
  //show loader while getting data on scroll event
  showSpinner1: boolean;
  //array to fix the datatable header
  dataTableElementId1: string = 'main_contents';

  // --------------------------------- Collateral Advance Rate Grid variables---------------------------------
  collateralAdvanceRateGridModel: CustomGridModel;
  toogleSearchBox2: boolean;
  toogleCloseBox2: boolean;
  searchTerm2: string = CyncConstants.BLANK_STRING;
  gridData2: Division[] = [];
  //@ViewChild(DataTable) dataTableComponent: DataTable;
  toggleEditIcon2: boolean;
  toggleDeleteIcon2: boolean;
  toggleReloadIcon2: boolean;
  isDataLoading2: boolean;
  recordCount2: number = -1;
  recordTotal2: number;
  showTotalrecords2: number = 0;
  loadCount2: number = 0;
  load_more2: boolean;
  showCount2: number = 1;
  rowCount2: number = CyncConstants.getDefaultRowCount();
  selectedRows2: any[] = [];
  // array to display the export columns
  exportColumns2: ExportColumn[] = [];
  toogleExportConfirmPoupup2: boolean;
  isExportWarningPopupVisible2: boolean;
  searchPageCount2: number = 1;
  //show loader while getting data on scroll event
  showSpinner2: boolean;
  //array to fix the datatable header
  dataTableElementId2: string = 'main_contents2';

  // --------------------------------- Common variables ---------------------------------
  isAddPermitted: boolean;
  isEditPermitted: boolean;
  isDeletePermitted: boolean;
  isExportPermitted: boolean = true;
  borrowerId: string;

  constructor(
    private _collateralAdvanceRateService: CollateralAdvanceRateService,
    private _helper: Helper,
    private _router: Router,
    private _apiMapper: APIMapper,
    private _message: MessageServices) {
    this.borrowerId = CyncConstants.getSelectedClient();
    //this.borrowerId = '37';
  }


  ngOnInit() {
    console.log("Inside on init");
    console.log(this.borrowerId);
    this.toogleSearchBox1 = true; // Show search icon on page load
    this.toogleCloseBox1 = false; // hide close icon on page load
    this.toogleSearchBox2 = true; // Show search icon on page load
    this.toogleCloseBox2 = false; // hide close icon on page load
    this.getPermissions();
    this.initializeGrid();
    this.setHeight1();
    //this.setHeight2();
  }

  /**
 * Initialize both grid collateral division and advance rate and get permissions
 */
  initializeGrid() {
    this._message.showLoader(true);

    this.collateralDivisionGridModel = {
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      apiDef: {
        getApi: this._apiMapper.endpoints[CyncConstants.GET_COLLATERAL_DIVISION_LIST].replace("{selectedClientId}", this.borrowerId),
        deleteApi: '', updateApi: ''
      },
      type: CyncConstants.COLLATERAL_DIVISION,
      columnDef: [
        { field: 'name', header: CyncConstants.COLLATERAL_DIVISION_NAME, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'description', header: CyncConstants.COLLATERAL_DIVISION_DESCRIPTION, sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
      ],
      responseKey: CyncConstants.COLLATERAL_DIVISION_RESPONSE_KEY,
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
      menuName: CyncConstants.COLLATERAL_DIVISION,
      isMoreIconsRequired: false
    };
    this.getGridData1(this.replaceApiQueryParams1(this.collateralDivisionGridModel.apiDef.getApi, this.showCount1));

  }
  /* ---------------------------------------- Common code start ----------------------------------------- */
  /** 
  * Call the helper method through service to get all the menu permissions
  */
  getPermissions() {
    this._collateralAdvanceRateService.getMenuPermission().subscribe(permissionsResponse => {
      this.isAddPermitted = this._collateralAdvanceRateService.getAddPermission(permissionsResponse);
      this.isEditPermitted = this._collateralAdvanceRateService.getEditPermission(permissionsResponse);
      this.isDeletePermitted = this._collateralAdvanceRateService.getDeletePermissions(permissionsResponse);
    });
  }

  /* ---------------------------------------- Collateral Divison code start---------------------------------------- */

  /**
	* Replace api query params
	* @param url 
	* @param pageNum 
	*/
  replaceApiQueryParams1(url: string, pageNum: number): string {
    return this._collateralAdvanceRateService.replaceQueryParams(url, pageNum, this.rowCount1);
  }

  /**
	* Call the api to get all collateral divison Grid data
	* @param url 
	*/
  getGridData1(url: string) {
    this._collateralAdvanceRateService.getGridData1(url).subscribe(apiResponse => {
      if (apiResponse.recordTotal != undefined) {
        this.recordTotal1 = apiResponse.recordTotal;
        this.showTotalrecords1 = this.recordTotal1;
      }
      this.gridData1 = apiResponse[this.collateralDivisionGridModel.responseKey];
      this.isDataLoading1 = true;
      this._message.showLoader(false);
    })
  }

  /**
	 * On Global Search this event gets fired
	 * @param event 
	 */
  onKeyUp1(event: any) {
    if (this.searchTerm1 == CyncConstants.BLANK_STRING || this.searchTerm1 == undefined || this.searchTerm1 == null) {
      this.toogleCloseBox1 = false;// hide close icon 
      this.toogleSearchBox1 = true;// Show search icon 
      //reinitialize page count
      this.showCount1 = 1;
      //reinitialize search page count
      this.searchPageCount1 = 1;
      //reload grid data
      this.getGridData1(this.replaceApiQueryParams1(this.collateralDivisionGridModel.apiDef.getApi, this.showCount1));
    } else {
      this.toogleCloseBox1 = true;// Show close icon
      this.toogleSearchBox1 = false;// Hide search icon 
      //Call the search API and reload the grid data
      this._helper.scrollTopDataTable(this.dataTableElementId1);
      this.reloadGridData1(this.searchTerm1);
    }
  }

  /**
	 * Reoload the grid data based on the search term
	 * @param searchTerm 
	 */
  reloadGridData1(searchTerm: string) {

		/**
		 * PLEASE DONT REMOVE BELOW COMMENTED CODE
		 * If only search api is called,below code is used
		 */
    // let apiEndpoint = this._apiMapper.searchAPIs[CyncConstants.SEARCH_INELIGIBILITY_REASONS];
    // apiEndpoint = apiEndpoint + searchTerm;
    // this.getGridData(apiEndpoint);

    //If sorting and pagination params are used along with search param below code is used
    let endpoint = this.replaceApiQueryParams1(this.collateralDivisionGridModel.apiDef.getApi, this.searchPageCount1);
    endpoint = endpoint + '&search=' + searchTerm;
    this.getGridData1(endpoint);
  }


  /**
	 * On click of close icon this event gets fired
	 */
  clearSearchBox1() {
    //this.dataTableComponent.reset();
    this.searchTerm1 = CyncConstants.BLANK_STRING;
    this.toogleCloseBox1 = false;
    this.toogleSearchBox1 = true;
    this.recordCount1 = -1;
    //reinitialize page count
    this.showCount1 = 1;
    //reinitialize search page count
    this.searchPageCount1 = 1;
    //reload grid data
    this.getGridData1(this.replaceApiQueryParams1(this.collateralDivisionGridModel.apiDef.getApi, this.showCount1));
  }

  /**
 	* Routing to Add page
 	*/
  goToAdd1() {
    this._router.navigateByUrl(this._router.url + '/add');
  }

  /**
 	* Routing to Edit page
 	*/
  goToEdit1() {
    if (this.selectedRows1.length == 1) {
      this._router.navigateByUrl(this._router.url + '/' + this.selectedRows1[0].id);
    }
  }

  /**
	 * On click of grid row route to edit page
	 * @param event 
	 */
  goToView1(event: any) {
    if (event.type == CyncConstants.CHECKBOX_EVENT_TYPE) {
      this.updateGridIcons1();
    } else if (event.type == CyncConstants.ROW_EVENT_TYPE && this.isEditPermitted) {
      this.selectedRows1 = [];
      let rowId = event.data.id;
      this._router.navigateByUrl(this._router.url + '/' + rowId);
    }
  }

  /**
	 * Update Edit and Delete Icons based on the row selection
	 */
  updateGridIcons1() {
    this.updateDeleteIcon1();
    this.updateEditIcon1();
  }

  /**
	 * Update edit icon
	 */
  updateEditIcon1() {
    if (this.isEditPermitted) {
      this.toggleEditIcon1 = this.selectedRows1 != undefined && this.selectedRows1.length == 1;
    }
  }

	/**
	 * Update delete icon
	 */
  updateDeleteIcon1() {
    console.log("Updated delete icon");
    console.log(this.selectedRows1.length);
    if (this.isDeletePermitted) {
      this.toggleDeleteIcon1 = this.selectedRows1 != undefined && this.selectedRows1.length > 0;
    }
  }

  /**
	 * On Unselect of a grid checkbox update the Icons
	 */
  unSelectChkBox1() {
    this.updateGridIcons1();
  }

	/**
	 * On select of all checkbox update delete icon
	 */
  selectAllChkBox1() {
    this.updateDeleteIcon1();
  }

  /**
  * On column search this event gets fired
  * @param event 
  */
  printFilteredData1(event: any) {
    //console.log(":::printFilteredData");
    if (event.filteredValue != undefined) {
      this.recordCount1 = event.filteredValue.length;
      if (this.recordCount1 == this.gridData1.length) {
        this.recordCount1 = -1;
      }
    }
  }

  /** 
	 * On click of delete icon show pop up
	*/
  delete1() {
    this.showConfirmationPopup1();
  }

	/**
	 * Show confirmation pop up with selected records 
	 */
  showConfirmationPopup1() {
    //console.log("::selectedRows----", this.selectedRows);
    this._helper.openConfirmPopup({ "title": CyncConstants.CONFIRMATION_POPUP_TITLE, "message": this._collateralAdvanceRateService.getConfirmationPopupMessage(this.selectedRows1, 'name'), "msgType": "warning" }).subscribe(result => {
      if (result) {
        //console.log("user has clicked on yes");
        this._message.showLoader(true);
        this.deleteSelectedRecords1();
      } else {
        //console.log("user has clicked on cancel");
        //unselect all the checkbox
        this.selectedRows1 = [];
        this.updateGridIcons1();
      }
    });
  }

	/**
	 * Call the API to delete selected records
	 */
  deleteSelectedRecords1() {
    let apiEndpoint = this._apiMapper.endpoints[CyncConstants.DELETE_MULTIPLE_COLLATERAL_DIVISION_RECORDS].replace("{selectedClientId}", this.borrowerId);
    this._collateralAdvanceRateService.deleteCollateralDivision(this.selectedRows1, 'id', apiEndpoint).subscribe(deleteResponse => {
      //console.log("::deleteResponse----", deleteResponse);
      if (deleteResponse.status == CyncConstants.STATUS_204 || deleteResponse.status == CyncConstants.STATUS_200) {
        this._message.showLoader(false);
        //show success message after deleting records
        this.fireSuccessMsg(CyncConstants.DELETE_SUCCESS_MSG);
        //reload grid data after successful deletion
        this.reloadGridData1(CyncConstants.BLANK_STRING);
        //unselect all the checkbox and update the grid icons
        this.selectedRows1 = [];
        this.updateGridIcons1();

      }
    });
  }

	/**
	 * Show Success Message
	 * @param successMsg 
	 */
  fireSuccessMsg(successMsg: string) {
    this._collateralAdvanceRateService.showSuccessMessage(successMsg);
  }

  //Export code starts

	/**
	 * Show pop up for export with column selection
	 */
  showDialogForExport1() {
    this.toogleExportConfirmPoupupFlag1();
    this.exportColumns1 = [];
    this.exportColumns1 = this._helper.getExportColumns(this.collateralDivisionGridModel.columnDef);
  }

  toogleExportConfirmPoupupFlag1() {
    this.toogleExportConfirmPoupup1 = !(this.toogleExportConfirmPoupup1);
  }

  exportSelectedColumns1(selectedColumns: ExportColumn[]) {
    //console.log("::selectedColumns---", selectedColumns);
    let queryParam: string = this._helper.getExportQueryParam(this.selectedRows1, selectedColumns);
    if (queryParam != undefined && queryParam.length > 0) {
      //set the apiendpoint
      let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_COLLATERAL_DIVISION].replace("{selectedClientId}", this.borrowerId);
      //hide the export popup
      this.toogleExportConfirmPoupupFlag1();
      this._message.showLoader(true);
      this._collateralAdvanceRateService.exportData(queryParam, apiEndpoint).subscribe(blob => {
        //console.log('::export successful');
        //unselect all checkboxes
        this.selectedRows1 = [];
        //empty all  columns in the popup
        this.exportColumns1 = [];
        //update grid icons
        this.updateGridIcons1();
        //download the xls file
        this._helper.downloadFile(blob, this.collateralDivisionGridModel.type);
        this._message.showLoader(false);
      });
    } else {
      //If all the columns are unchecked show warning msg to select atleast one column
      this.toogleExportConfirmPoupup1 = true;
      this.isExportWarningPopupVisible1 = true;
    }
  }
  //Export code ends


	/** 
	 * On Scroll load grid data
	*/
  onScroll1(event) {
    //call helper method to fix the table header
    this._helper.fixTableHeader(event.target, this.collateralAdvanceRateGridModel.isAdvanceSearchAvailable);
    if (this._helper.isScollbarAtBottom(this.dataTableElementId1)) {
      this.load_more1 = true;
    } else {
      this.load_more1 = false;
    }
    let endpoint = '';
    if (this.load_more1 && this.gridData1.length < this.recordTotal1) {
      this.showCount1 = this.showCount1 + 1;
      if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
        this.showSpinner1 = true;
      }
      if (this.searchTerm1.length > 0) {
        this.searchPageCount1 = this.searchPageCount1 + 1;
        endpoint = this.replaceApiQueryParams1(this.collateralAdvanceRateGridModel.apiDef.getApi, this.searchPageCount1);
        endpoint = endpoint + '&search=' + this.searchTerm1;
      } else {
        endpoint = this.replaceApiQueryParams1(this.collateralAdvanceRateGridModel.apiDef.getApi, this.showCount1);
      }
      this._collateralAdvanceRateService.getGridData1(endpoint).subscribe(apiResponse => {
        this.gridData1 = this.gridData1.concat(apiResponse[this.collateralAdvanceRateGridModel.responseKey]);
        this.showSpinner1 = false;
      });
    }
  }

  /**
  * Auto adjust height for collateral divison codes
  */
  setHeight1() {
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
  /* ---------------------------------------- Collateral Advacne rate code start---------------------------------------- */



  /**
  * Auto adjust height for collateral advance rates
  */
  setHeight2() {
    var appbody_cont = window.innerHeight;
    $(window).resize(function () {
      appbody_cont = window.innerHeight;
      if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
      if (document.getElementById("main_contents2")) { document.getElementById('main_contents2').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 70) + 'px'; }
    })
    if (document.getElementById("app-body-container")) { document.getElementById('app-body-container').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 16) + 'px'; }
    setTimeout(function () {
      if (document.getElementById("main_contents2")) { document.getElementById('main_contents2').style.height = (appbody_cont - 90 - 32 - 32 - 32 - 32 - 25 - 32 - 32 - 32 - 16 - 70) + 'px'; }
    }, 50);
  }
}
