import { Component, OnInit, Input, ElementRef, ViewChild, HostListener, NgZone, OnDestroy } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ConnectionBackend } from '@angular/http';
import { CustomGridModel } from './custom-grid.model';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { DataTable } from 'primeng/components/datatable/datatable';
import { Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { DeleteModal } from '@cyncCommon/component/message/delete.modal.component';
import { AppConfig } from '@app/app.config';
import { Location, DatePipe } from '@angular/common';
import { URLSearchParams } from '@angular/http';
import { HtmlFilterPipe } from '@cyncCommon/Pipes/html-filter.pipe';
import { CalendarEvent } from 'angular-calendar';
import { subDays, addDays } from 'date-fns';
import { ViewEncapsulation } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CommonAPIs } from '@cyncCommon/utils/common.apis'
import { UserPermission } from '@app/shared/models/user-permissions.model'
import { ExportColumn } from '@app/shared/models/export-columns.model';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs';

declare var $: any;

@Component({
  selector: 'custom-grid',
  templateUrl: './custom-grid.html',
  encapsulation: ViewEncapsulation.None

})

export class CustomGridComponent implements OnInit, OnDestroy {
  @Input() gridModel: CustomGridModel;
  @ViewChild(DataTable) dataTableComponent: DataTable;
  lenderId: any;
  recordTotal: number;
  gridData: any = [];
  loading = false;
  clickCount: number = 0;
  clickCountShow: number = 0;
  locationBack: any;
  deleteReqModel: any;
  deleteCount = 0
  deleteIds: string = '';
  editUrl: any;
  editField: string;
  amountValue: any;
  isEdited = false;
  requestModel: any;
  exportColArray: any[] = [];
  exportSelectedCol: any[] = [];
  checked: any[] = [];
  loadCount = 0;
  load_more = false;
  pageNumber = 1;
  ShowmoreData: any = [];
  exportHeaderArray: any;
  exportRowArray: any;
  toogleGlobalSearchIcon: boolean = true;
  toogleGlobalSearchCloseIcon: boolean = false;
  rowcount: number = CyncConstants.getDefaultRowCount();
  isAddPermitted: boolean;
  isEditPermitted: boolean;
  isDeletePermitted: boolean;
  selectedRows: any = [];
  searchTerm: any;
  toggleDeleteIcon: boolean;
  toggleEditIcon: boolean;
  toggleReloadIcon: boolean;
  showNotificationMsgPopup: boolean = false;
  notificationMessage: any;
  userPermissions: UserPermission[];
  isGridDataLoaded: boolean = false;

  exportColumns: ExportColumn[] = [];
  toogleExportConfirmPoupup: boolean = false;
  toogleExportWarningPopup: boolean = false;
  filterRecordCount: number = -1;
  showSpinner: boolean;
  borrowerId: string;
  deleteMsgArray: any[] = [];
  clientSelectionSubscription: Subscription;
  dataTableElementId: string = 'cync_main_contents';

  constructor(
    private _delete: DeleteModal, private _location: Location,
    private config: AppConfig, private _customHttpService: CyncHttpService,
    private _router: Router, private _message: MessageServices,
    private _helper: Helper,
    private _apiMapper: APIMapper,
    private _commonAPIs: CommonAPIs,
    private _clientSelectionService: ClientSelectionService
  ) {
    this.lenderId = this.config.getConfig('lenderId');
    this.borrowerId = CyncConstants.getSelectedClient();
  }

  ngOnInit() {
    this._message.showLoader(true);
    sessionStorage.removeItem('borrowerId');
    this.loading = true;
    this.registerReloadGridOnClientSelection();
    if (this.gridModel.permissionRequired) {
      this.getUserPermission();
    } else {
      this.getData();
    }
  }


  registerReloadGridOnClientSelection() {
    if (this.gridModel.reloadGridDataOnClientSelection) {
      var __this = this;
      this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
        this._message.showLoader(true);
        __this.gridData = [];
        __this.borrowerId = clientId;
        __this.getData();
      });
    }

  }

  /**
   * get user permission
   */
  getUserPermission() {
    let userRole = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
    this._commonAPIs.getUserPermission(this.gridModel.menuName, userRole).subscribe(permissions => {
      this.userPermissions = permissions;
      this.checkUserPermissions(userRole);
    });
  }

  /**
   *
   * @param roleId
   */
  checkUserPermissions(roleId: string) {
    // below is not required becase permission should be checked for all users. even admin also
    let roleType = localStorage.getItem('cyncUserRole');
    if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
      this.isAddPermitted = this.checkPermissionForMenu(CyncConstants.CREATE); // this also can be constant
      this.isDeletePermitted = this.checkPermissionForMenu(CyncConstants.DELETE);
      this.isEditPermitted = this.checkPermissionForMenu(CyncConstants.EDIT);
    } else {
      this.isAddPermitted = true;
      this.isDeletePermitted = true;
      this.isEditPermitted = true;
    }
    this.getData();
  }

  /**
   *
   * @param menuName
   * @param actionType
   */
  // checkPermissionForMenu(actionType: string): boolean {
  //   for (var i = 0; i < this.userPermissions.length; i++) {
  //     var everyPermissions = this.userPermissions[i];
  //     for (var j = 0; j < everyPermissions.length; j++) {
  //       if (everyPermissions[j].action == actionType) {
  //         return everyPermissions[j].enabled;
  //       }
  //     }
  //   }
  // }

  /**
   * 
   * @param menuName 
   * @param actionType 
   */
  checkPermissionForMenu(actionType: string): boolean {
    for (var i = 0; i < this.userPermissions.length; i++) {
      if (this.userPermissions[i].action == actionType) {
        return this.userPermissions[i].enabled;
      }
    }
  }

  /**
   * get data intially in grid
   */
  getData() {
    let endpoint = this.replaceQueryParamsGridDataEndPoint();
    if(this.gridModel.type == 'Loan Type'){
      this._customHttpService.getService('MCL', endpoint).subscribe(result => {
        const apiResponse = JSON.parse(result._body);
        this.recordTotal = apiResponse.recordTotal;
        this.gridData = apiResponse[this.gridModel.responseKey];
        this.isGridDataLoaded = true;
        this._message.showLoader(false);
      });
      this.pageNumber = 1;
    }else{
      this._customHttpService.get(endpoint).subscribe(result => {
        const apiResponse = JSON.parse(result._body);
        this.recordTotal = apiResponse.recordTotal;
        this.gridData = apiResponse[this.gridModel.responseKey];
        this.isGridDataLoaded = true;
        this._message.showLoader(false);
      });
      this.pageNumber = 1;
    }
    
  }

  /**
   * route to add page
   */
  goToAdd() {
    this._router.navigateByUrl(this._router.url + '/add');
  }

  /**
   * update grid icons based on permission  (add,update,delete)
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
   * route to edit page
   * @param event
   */
  goToEdit(event: any) {
    if (this.isEditPermitted && this.selectedRows !== undefined && this.selectedRows.length == 1) {
      this._router.navigateByUrl(this._router.url + "/" + this.selectedRows[0].id);
    }
  }

  /**
 * This method is used to delete records
 *
 */
  delete() {
    let idsToBeDeleted = [];
    this.deleteMsgArray = [];
    for (let ids of this.selectedRows) {
      idsToBeDeleted.push(ids.id);
      this.deleteMsgArray.push(ids[this.gridModel.deletePopupParameter]);
    }
    const popupParam = { 'title': 'Confirmation', 'message': 'Are you sure you want to delete ' + ' ' + this.deleteMsgArray.join(',') + ' ?', 'msgType': 'warning' };
    this._helper.openConfirmPopup(popupParam).subscribe(result => {
      if (result) {
        this._message.showLoader(true);
        this.deleteRowsData(idsToBeDeleted);
      } else {
        this.selectedRows = [];
        this.unSelectChkBox();
      }
    });
    this._message.showLoader(false);
  }

  /**
   * this method will take selected rows id and will call api to delete thoese records   *
   * @param idsToBeDeleted
   */
  deleteRowsData(idsToBeDeleted: any[]) {
    let deleteEndpoint = '';
    if (this.gridModel.apiDef.deleteApi.indexOf('?') == -1) {
      deleteEndpoint = (this.gridModel.apiDef.deleteApi).replace("{clientId}", this.borrowerId) + '?ids=' + idsToBeDeleted;
    } else {
      deleteEndpoint = (this.gridModel.apiDef.deleteApi).replace("{clientId}", this.borrowerId).split('?')[0] + "?ids=" + idsToBeDeleted
    }
    if(this.gridModel.type == 'Loan Type'){
      this._customHttpService.deleteService('MCL', deleteEndpoint, '').subscribe(response => {
        this._message.addSingle("Record Deleted Successfully", "success");
        this.pageNumber = 1;
        this.getData();
        this.selectedRows = [];
        this.unSelectChkBox();
      });
    }else{
      this._customHttpService.delete(deleteEndpoint).subscribe(response => {
        this._message.addSingle("Record Deleted Successfully", "success");
        this.pageNumber = 1;
        this.getData();
        this.selectedRows = [];
        this.unSelectChkBox();
      });
    }
  }

  /**
 * This method is used to unselect all check box
 *
 */
  unSelectChkBox() {
    this.updateGridIcons();
  }

  /**
 * This method is used for search record from api
 * @param event
 */
  onKey(event: any) {
    if (this.searchTerm == CyncConstants.BLANK_STRING || this.searchTerm == undefined || this.searchTerm == null) {
      this.searchTerm = '';
      this.toogleGlobalSearchCloseIcon = false;
      this.toogleGlobalSearchIcon = true;

    }
    else {
      this.toogleGlobalSearchCloseIcon = true;
      this.toogleGlobalSearchIcon = false;
    }


    if (this.gridModel.searchViaAPI) {
      this.pageNumber = 1;
      this._helper.scrollTopDataTable(this.dataTableElementId);
      let endpointUrl = this.replaceQueryParamsGridDataEndPoint() + '&search=' + this.searchTerm;
      if(this.gridModel.type == 'Loan Type'){
        this._customHttpService.getService('MCL', endpointUrl).subscribe(result => {
          const searchapiResponse = JSON.parse(result._body);
          this.gridData = searchapiResponse[this.gridModel.responseKey];
          this.recordTotal = searchapiResponse.recordTotal;
        });
        this._message.showLoader(false);
      }else{
        this._customHttpService.get(endpointUrl).subscribe(result => {
          const searchapiResponse = JSON.parse(result._body);
          this.gridData = searchapiResponse[this.gridModel.responseKey];
          this.recordTotal = searchapiResponse.recordTotal;
        });
        this._message.showLoader(false);
      }
     
    }


  }

  /**
 * This method is used to select all check box
 *
 */
  selectAllChkBox() {
    if (this.isDeletePermitted) {
      this.toggleDeleteIcon = this.selectedRows != undefined && this.selectedRows.length > 0;
    }
  }

  /**
 * This method is used to clear the global search box
 *
 */
  clearSearchBox() {
    this.dataTableComponent.reset();
    this.searchTerm = '';
    this.toogleGlobalSearchCloseIcon = false;
    this.toogleGlobalSearchIcon = true;
  }

  /**
 * This method is used to load more data on scroll
 * @param event
 */
  onScroll(event) {
    if (this.gridModel != undefined) {
      this._helper.fixTableHeader(event.target, this.gridModel.isAdvanceSearchAvailable);
      if (this._helper.isScollbarAtBottom(this.dataTableElementId)) { 
        this.load_more = true;
      } else {
        this.load_more = false;
      }
      if (this.load_more == true && this.gridModel.isPaginationRequired && this.gridData.length < this.recordTotal) {
        if (CyncConstants.SHOW_ON_SCROLL_DATA_LOADER_PROPERTY) {
          this.showSpinner = true;
        }

        this.pageNumber = this.pageNumber + 1;
        let endpointUrl = this.replaceQueryParamsGridDataEndPoint();
        if (this.gridModel.searchViaAPI && this.searchTerm != undefined && (this.searchTerm.length > 0)) {
          endpointUrl = endpointUrl + '&search=' + this.searchTerm;
        }
        if(this.gridModel.type == 'Loan Type'){
          this._customHttpService.getService('MCL',endpointUrl).subscribe(result => {
            const apiResponse = JSON.parse(result._body);
            this.gridData = this.gridData.concat(apiResponse[this.gridModel.responseKey]);
            this.showSpinner = false;
            this._message.showLoader(false);
          });
        }else{
          this._customHttpService.get(endpointUrl).subscribe(result => {
            const apiResponse = JSON.parse(result._body);
            this.gridData = this.gridData.concat(apiResponse[this.gridModel.responseKey]);
            this.showSpinner = false;
            this._message.showLoader(false);
          });
        }
      }
    }
  }




  //Export code starts

	/**
	 * Show pop up for export with column selection
	 */
  showDialogForExport() {
    this.toogleExportConfirmPoupupFlag();
    this.exportColumns = [];
    this.exportColumns = this._helper.getExportColumns(this.gridModel.columnDef);
  }

  toogleExportConfirmPoupupFlag() {
    this.toogleExportConfirmPoupup = !(this.toogleExportConfirmPoupup);
  }

  toogleExportWarningPopupFlag() {
    this.toogleExportWarningPopup = !(this.toogleExportWarningPopup);
  }

  exportSelectedColumns(selectedColumns: ExportColumn[]) {
    console.log("::selectedColumns---", selectedColumns);
    let queryParam: string = this._helper.getExportQueryParam(this.selectedRows, selectedColumns);
    if (queryParam != undefined && queryParam.length > 0) {
      //hide the export popup
      this.toogleExportConfirmPoupupFlag();
      this._message.showLoader(true);
      let endpointUrl = this.gridModel.apiDef.getApi.replace(CyncConstants.BORROWER_ID_VALUE, this.borrowerId);
      this._customHttpService.getExportCall(endpointUrl.split('?')[0], queryParam).subscribe(blob => {
        //console.log('::export successful');
        //unselect all checkboxes
        this.selectedRows = [];
        //empty all  columns in the popup
        this.exportColumns = [];
        //update grid icons
        this.updateGridIcons();
        //download the xls file
        this._helper.downloadFile(blob, this.gridModel.type);
        this._message.showLoader(false);
      });
    } else {
      //If all the columns are unchecked show warning msg to select atleast one column
      //this.toogleExportConfirmPoupupFlag();
      this.toogleExportWarningPopupFlag();
    }
  }

  //Export code ends

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
	 * unsubscribe the observable for client change
	 */
  ngOnDestroy() {
    if (this.gridModel.reloadGridDataOnClientSelection) {
      this.clientSelectionSubscription.unsubscribe();
    }
  }

  replaceQueryParamsGridDataEndPoint(): string {
    return this.gridModel.apiDef.getApi.replace(CyncConstants.SORT_BY_PARAM_VALUE, CyncConstants.DESC_ORDER)
      .replace(CyncConstants.ORDER_BY_PARAM_VALUE, CyncConstants.ORDER_BY_UPDATED_AT)
      .replace(CyncConstants.PAGE_PARAM_VALUE, this.pageNumber.toString())
      .replace(CyncConstants.ROWS_PARAM_VALUE, this.rowcount.toString())
      .replace(CyncConstants.BORROWER_ID_VALUE, this.borrowerId);
  }

}

