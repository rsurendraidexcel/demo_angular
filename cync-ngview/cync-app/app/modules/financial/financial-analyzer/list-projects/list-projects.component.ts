import { Component, OnInit, HostListener } from '@angular/core';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { ListProjectService } from '../service/list-project.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { Router } from '@angular/router';

import { CommonAPIs } from '@cyncCommon/utils/common.apis';

import { ExportColumn } from '@app/shared/models/export-columns.model';
import { RequestOptions, Request, RequestMethod } from '@angular/http';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { FinancialStatementsService } from '../../financial-statements/services/financial-statements.service';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs/Subscription';
import { ColumnDefinition } from '@cyncCommon/component/grid/grid.model';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
  selector: 'app-list-projects',
  templateUrl: './list-projects.component.html',
  styleUrls: ['./list-projects.component.scss']
})

/**
 * @author : Shruti Karekal
 */
export class ListProjectsComponent implements OnInit {
  clientSelectionSubscription: Subscription;
  listListProjectModel: CustomGridModel;
  folderListProjectModel: CustomGridModel;
  assetsPath: string = CyncConstants.getAssetsPath();
  isFileInsideFolder = false;
  //Grid Variables
  globalSearchIcon: boolean = true;
  globalSearchCloseIcon: boolean = false;
  searchTerm: string = '';
  gridData: any = [];
  loadCount = 0;
  pageNumber =  CyncConstants.PAGE_NUMBER;
  rowcount = 25;
  recordTotal: number;
  selectedRows: any = [];
  toggleDeleteIcon: boolean;
  toggleEditIcon: boolean;
  dataTableElementId: string = 'cync_main_contents';
  toggleExportModal: boolean;
  toggleExportErrorModal: boolean;
  borrowerId: string;
  isGridDataLoaded: boolean = false;
  direction = 'DESC';
  sortBy = 'lastModifiedDate';
  filterRecordCount: number = -1;
  folderName: string = '';
  clientID: any;
  folderId: string = '';
  isChecked: any;
  projectFolderId: string;
  autoNewClient = 'Auto New Client'; //This is used in Html file to show checkbox for this header

  // array to display the export columns
  exportColumns: ExportColumn[] = [];

  //show loader on scroll event
  showSpinner: boolean;

  constructor(private _customHttpService: CustomHttpService,
    private _router: Router,
    private _commonAPIs: CommonAPIs,
    private listProjectService: ListProjectService,
    private _apiMapper: APIMapper,
    private _helper: Helper,
    private _message: MessageServices,
    private _radioButtonVisible:RadioButtonService,
    private _financialStatementsService: FinancialStatementsService,
    private _clientSelectionService: ClientSelectionService) {
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {

    this.listListProjectModel = {
      //Change key name for Posting Type once API is ready
      //Also in API Mapper the search api is not working
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: CyncConstants.LIST_PROJECT_GRID_MODEL_TYPE,
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.GET_ALL_LIST_PROJECT_API], deleteApi: this._apiMapper.endpoints[CyncConstants.DELETE_LIST_PROJECT_BY_ID], updateApi: '' },
      columnDef: [
        { field: 'name', header: 'Projects', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'lastModifiedDate', header: 'Last Modified', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'id', header: 'id', sortable: true, isTemplate: false, templateHtml: '', hidden: true, filter: true },
        { field: 'lastModifiedDate', header: 'folder', sortable: true, isTemplate: false, templateHtml: '', hidden: true, filter: true }

      ],
      responseKey: 'data',
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
      menuName: 'financial_analyzer',
      permissionRequired: true,
      isMoreIconsRequired: false
    }

    this.folderListProjectModel = {
      //Change key name for Posting Type once API is ready
      //Also in API Mapper the search api is not working
      infiniteScroll: true,
      multiSelection: false,
      onDemandLoad: true,
      singleSelection: false,
      type: CyncConstants.LIST_PROJECT_GRID_MODEL_TYPE,
      apiDef: { getApi: this._apiMapper.endpoints[CyncConstants.LIST_PROJECT_FOLDER_API], deleteApi: this._apiMapper.endpoints[CyncConstants.FOLDER_LIST_PROJECT], updateApi: '' },
      columnDef: [
        { field: 'name', header: 'Projects', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'description', header: 'Description', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'lastModifiedDate', header: 'Last Modified', sortable: true, isTemplate: false, templateHtml: '', hidden: false, filter: true },
        { field: 'id', header: 'id', sortable: true, isTemplate: false, templateHtml: '', hidden: true, filter: true },
        { field: 'lastModifiedDate', header: 'folder', sortable: true, isTemplate: false, templateHtml: '', hidden: true, filter: true }

      ],
      responseKey: 'data',
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
      menuName: 'financial_analyzer',
      permissionRequired: true,
      isMoreIconsRequired: false
    }
    this.getGridData();
    this.registerReloadGridOnClientSelection();

  }

  /**
   * This method replaces the request params with original value
   * @param url
   */
  getAllListProjectAPIUrl(url: string) {
    return url.replace('{direction}', this.direction).replace('{sortBy}', this.sortBy).replace('{page}', this.pageNumber.toString()).replace('{rows}', this.rowcount.toString());
  }

  /**
   * GRID FUNCTIONS BEGIN
   */

  /**
   * Method that gets called on scroll
   */
  onScroll(event) {
    //fix datatable header
    this._helper.fixTableHeader(event.target, this.listListProjectModel.isAdvanceSearchAvailable);
    let load_more: boolean;
    if (this._helper.isScollbarAtBottom(this.dataTableElementId)) { load_more = true; } else { load_more = false; }
    if (load_more == true && (this.gridData.length < this.recordTotal)) {
      if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
        this.showSpinner = true;
      }
      let url = '';
      if (!this.isFileInsideFolder) {
        this.pageNumber = this.pageNumber + 1;
        url = this.getAllListProjectAPIUrl(this.listListProjectModel.apiDef.getApi).replace('{clientId}', this.borrowerId);
      } else {
        this.pageNumber = this.pageNumber + 1;
        url = this.getAllListProjectAPIUrl(this.folderListProjectModel.apiDef.getApi).replace('{folderId}', this.projectFolderId);
      }
      if (this.searchTerm.length > 0) {
        url = url + this.searchTerm;
      }
      this.listProjectService.getAllListProject(url).subscribe(res => {
        this.gridData = this.gridData.concat(res[this.listListProjectModel.responseKey]);
        this.showSpinner = false;
        this._message.showLoader(false);
      });
    }
  }

  /**
   * Method to get all the grid data
   */
  getGridData() {
    
    this.isGridDataLoaded = false;
    this.isFileInsideFolder = true;
    this._message.showLoader(true);
    if (this.borrowerId == undefined || this.borrowerId == null) {
      this._helper.showApiMessages(CyncConstants.CLIENT_SELECTION_MESSAGE, 'danger');
      this._message.showLoader(false);
    }
    else {
     // console.log("this.borrowerId",this.borrowerId);
      let url = this.getAllListProjectAPIUrl(this.listListProjectModel.apiDef.getApi).replace('{clientId}', this.borrowerId);
      this.listProjectService.getAllListProject(url).subscribe(res => {
        this.recordTotal = res.recordTotal;
        this.gridData = res[this.listListProjectModel.responseKey];
        this.isGridDataLoaded = true;
        this.isFileInsideFolder = false;
        this._message.showLoader(false);
      });
    }
  }

  /**
   * Method to get all the grid data
   */
  getFolderGridData(id) {
    this.isGridDataLoaded = false;
      this.isFileInsideFolder = false;
    this._message.showLoader(true);
    this.projectFolderId = id;
    this.pageNumber = CyncConstants.PAGE_NUMBER;
    this.rowcount = 25;
    let url = this.getAllListProjectAPIUrl(this.folderListProjectModel.apiDef.getApi).replace('{folderId}', id);
    this.listProjectService.getAllFolderListProject(url).subscribe(ListProjectData => {
      this.recordTotal = ListProjectData.recordTotal;
      this.gridData = ListProjectData[this.folderListProjectModel.responseKey];
      this.isGridDataLoaded = true;
      this.isFileInsideFolder = true;
      this._helper.scrollTopDataTable(this.dataTableElementId);
      this.searchTerm = '';
      this.globalSearchCloseIcon = false;
      this.globalSearchIcon = true;
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
      this.globalSearchCloseIcon = true;
      this.globalSearchIcon = false;
    }
    let apiEndpoint = '';
    if (!this.isFileInsideFolder) {
      if (this.listListProjectModel.searchViaAPI) {
        apiEndpoint = this.appendSearchTerm(this.listListProjectModel.apiDef.getApi, this.searchTerm)
      }
    } else if (this.folderListProjectModel.searchViaAPI) {
      apiEndpoint = this.appendSearchTerm(this.folderListProjectModel.apiDef.getApi, this.searchTerm)
    }
    this.pageNumber =  CyncConstants.PAGE_NUMBER;
    this._helper.scrollTopDataTable(this.dataTableElementId);
    this.listProjectService.getAllListProject(apiEndpoint).subscribe(apiResponse => {
      this.gridData = apiResponse[this.listListProjectModel.responseKey];
      this.recordTotal = apiResponse.recordTotal;
    });
  }

  /**
   * This method appends the search Term
   * @param url
   * @param searchTerm
   */
  appendSearchTerm(url: string, searchTerm: string): string {
    if (!this.isFileInsideFolder) {
      url = this.getAllListProjectAPIUrl(url).replace('{clientId}', this.borrowerId);
    } else {
      url = this.getAllListProjectAPIUrl(url).replace('{folderId}', this.projectFolderId);
    }
    if (!(searchTerm != null && searchTerm != undefined && searchTerm.length > 0)) {
      searchTerm = '';
    }
    url = url + searchTerm;
    return url;
  }

  /**
   * This method gets called on click of Folder Icon
   */
  fnShowProject(file: any) {
    this.gridData=[];
    this.selectedRows = [];
    this.folderName = file.name;
    this.folderId = file.id;
    this.getFolderGridData(file.id);
  }

  /**
   * This method gets called on click of Back Icon from folder
   */
  fnShowGridProject() {
    this.gridData=[];
    this.selectedRows = [];
    this._helper.scrollTopDataTable(this.dataTableElementId);
    this.searchTerm = '';
    this.globalSearchCloseIcon = false;
    this.globalSearchIcon = true;
    this.pageNumber =  CyncConstants.PAGE_NUMBER;
    this.isFileInsideFolder = false;
    this.getGridData();
  }

  /**
   * This method gets called on click of Add Icon
   */
  goToAdd(folder) {
    if(folder){
     // console.log("folder",folder);
      let folderObj= {
        "id":this.folderId,
        "folderName":folder
      }
      CyncConstants.setFolderName(folderObj);
      this._router.navigateByUrl(this._router.url + '/add');
    }
    else{
      this._router.navigateByUrl(this._router.url + '/add');
    }
  }

  /**
   * Method when edit icon is clicked
   * @param event
   */
  goToEdit() {
    if (this.selectedRows !== undefined && this.selectedRows.length == 1) {
      this._router.navigateByUrl(this._router.url + "/" + this.selectedRows[0].id);
    }
  }

  /**
   * Method when delete icon is clicked
   */
  delete() {
    let idsToBeDeleted = [];
    let descForSelectedIds = [];
    let folderOrProjectTobeDeleteModal = [];
    for (let ids of this.selectedRows) {
      idsToBeDeleted.push(ids.id);
      descForSelectedIds.push(ids.name)
      folderOrProjectTobeDeleteModal.push({ "folder": ids.folder, "id": ids.id });
    }
    const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to delete ' + descForSelectedIds + '?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this.deleteSelectedRows(folderOrProjectTobeDeleteModal);

        // for (let folder of this.selectedRows) {
        //     if(folder.folder == true){
        //       this.deleteFolderSelectedRows(idsToBeDeleted);
        //     }else{
        //       this.deleteSelectedRows(idsToBeDeleted);
        //     }
        // }

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
  deleteSelectedRows(folderOrProjectTobeDeleteModal: any) {
    this.listProjectService.deleteListProject(this.listListProjectModel.apiDef.deleteApi, folderOrProjectTobeDeleteModal).subscribe(response => {
      this._helper.showApiMessages(CyncConstants.DELETE_MESSAGE, 'success');
      this.selectedRows = [];
      this.updateGridIcons();
      this.getGridData();
    });
  }

  /**
   * Method to update add/edit icons
   */
  updateGridIcons() {
    this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
    this.toggleEditIcon = this.selectedRows != undefined && this.selectedRows.length == 1 && this.selectedRows[0].folder == false;
  }

  /**
   *
   * @param selectedRow
   */
  goToView(selectedRow: any) {
    let event: any = selectedRow.originalEvent;
    if (selectedRow.type == 'checkbox') {
      this.updateGridIcons();
    } else if (selectedRow.type == 'row') {
      this.selectedRows = '';
      let rowId = selectedRow.data.id;
      //  this._router.navigateByUrl(this._router.url + "/" + rowId);
    }
  }

  /**
   * Method gets called when all the checkboxes are checked
   */
  selectAllChkBox() {
    this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;

  }

  /**
   * Method when we uncheck a checkbox
   */
  unSelectChkBox() {
    this.updateGridIcons();
  }

  /**
   *
   * @param id
   */
  fnSendId(id: any) {
    this._message.showLoader(true);
    this._financialStatementsService.getFinancialStatements(this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_STATEMENT_PROJECT_DATA].replace('{projectId}', id)).subscribe(res => {
    //  this._radioButtonVisible.setRadioButton(id)
      if (res.id == null) {
        this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH + '/' + id);
      }else{
        this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH_WITH_BALANCESHEET + '/' + id);
      } 
      // else if(res.bsSaved !== true){
      //   this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH_WITH_BALANCESHEET + '/' + id);
      // }else if(res.isSaved !== true){
      //   this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH_WITH_INCOME + '/' + id);
      // }else if(res.cfSaved !== true){
      //   this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH_WITH_CASHFLOW + '/' + id);
      // }else{
      //   this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH_WITH_SUMMAY + '/' + id);
      // }
      CyncConstants.setprojetID(id);
      this._message.showLoader(false);
    })

  }


  /**
   * view higlights
  **/
 fnShowHighlightProject(id:any) {
  this._message.showLoader(true);
  this._router.navigateByUrl(MenuPaths.LIST_FINANCE_STATMENTS_PATH_WITH_HIGHLIGHT + '/' + id);
  this._message.showLoader(false);
 }


  /**
   * This method enables the export dialog which has checkboxes for the columns to be exported
   */
  showDialogForExport() {
    let listProject = this.copyDataToShowExportDialog(this.listListProjectModel.columnDef);
    this.exportColumns = [];
    this.exportColumns = this._helper.getExportColumnsForFinance(listProject);
    this.toggleExportModal = true;
  }

  copyDataToShowExportDialog(dataList: ColumnDefinition[]) {
    let newList = JSON.parse(JSON.stringify(dataList));
    let data = newList.splice(0, 3);
    return data;
  }

  /**
   * This method enables the export dialog which has checkboxes for the columns to be exported
   */
  showFolderDialogForExport() {
    let listFolder = this.copyDataToShowExportDialog(this.folderListProjectModel.columnDef);
    this.exportColumns = [];
    this.exportColumns = this._helper.getExportColumnsForFinance(listFolder);
    this.toggleExportModal = true;
  }

  /**
	 * This method gets called to export the columns
	 * @param selectedColumns
	 */
  exportSelectedColumns(selectedColumns: ExportColumn[]) {
    let queryParam: string = this._helper.getExportQueryParamForFinance(this.selectedRows, selectedColumns);
    if (queryParam != undefined && queryParam.length > 0) {
      let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_FINANCIAL_SUMMARY_DATA].replace('{clientId}', this.borrowerId);
      this.toggleExportModal = false;
      this._message.showLoader(true);
      this.listProjectService.exportListProject(apiEndpoint, queryParam).subscribe(blob => {
        this.selectedRows = [];
        this.exportColumns = [];
        this.updateGridIcons();
        this.downloadFile(blob, this.listListProjectModel.type);
        this._message.showLoader(false);

            });
    } else {
      //If all the columns are unchecked show warning msg to select atleast one column
      this.toggleExportErrorModal = true;
      this.toggleExportModal = true;
    }
  }

  /**
	 * This method gets called to export the columns
	 * @param selectedColumns
	 */
  exportFolderSelectedColumns(selectedColumns: ExportColumn[]) {
    let queryParam: string = this._helper.getExportQueryParamForFinance(this.selectedRows, selectedColumns);
    if (queryParam != undefined && queryParam.length > 0) {
      let apiEndpoint = this._apiMapper.endpoints[CyncConstants.EXPORT_FOLDER_FINANCIAL_SUMMARY_DATA].replace('{folderId}', this.folderId);
      this.toggleExportModal = false;
      this._message.showLoader(true);
      this.listProjectService.exportListProject(apiEndpoint, queryParam).subscribe(blob => {
        this.selectedRows = [];
        this.exportColumns = [];
        this.updateGridIcons();
        this.downloadFile(blob, this.listListProjectModel.type);
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
  downloadFile(blob: Blob, filename: string) {
    let xlsFileName = filename + '.xlsx';
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
    this.pageNumber =  CyncConstants.PAGE_NUMBER;
    this._helper.scrollTopDataTable(this.dataTableElementId);
    if (!this.isFileInsideFolder) {
      this._message.showLoader(true);
      this.getGridData();
      this._message.showLoader(false);
    } else {
      this._message.showLoader(true);
      this.getFolderGridData(this.projectFolderId);
      this._message.showLoader(false);
    }
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
   * This method is taken care when user will change the client or borrowers
   */
  registerReloadGridOnClientSelection() {
    const currObj = this;
    this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
//      debugger;
      this._message.showLoader(true);
      const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', clientId);
      this.listProjectService.getBorrowerDetails(url).subscribe(data => {
        if (data !== undefined && data.borrower !== undefined
          && data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
          this.clientID = clientId;
          this.borrowerId = clientId;
          this.getGridData();
        }
       // currObj.borrowerId = clientId;
       // this.borrowerId = clientId;
      });
      this._message.showLoader(false);
    });
  }

  getClientDetails() {
    this._message.showLoader(true);
    const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', this.borrowerId);
    this.listProjectService.getBorrowerDetails(url).subscribe(data => {
      if (data !== undefined && data.borrower !== undefined
        && data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
        this.clientID = this.borrowerId;
      }
      this._message.showLoader(false);
      this.getGridData();
    });
  }

  /**
	 * unsubscribe the observable for client change
	 */
  ngOnDestroy() {
    if(this.clientSelectionSubscription!==undefined)
      this.clientSelectionSubscription.unsubscribe();
  }
}