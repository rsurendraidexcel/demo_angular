import { Component, OnInit, Input, ViewChild, ComponentRef, ElementRef } from '@angular/core';
import { GridOptions, IDatasource, IGetRowsParams } from "ag-grid-community";
import { TabsetComponent } from 'ngx-bootstrap';
import { AllCreditQueue, ListCreditQueue, DebtorDropdown, ClientDropdown } from "../model/credit-queue.model";
import { CreditQueueService } from "../service/credit-queue.service";
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { CustomTooltip } from '@cyncCommon/component/custom-tooltip/custom-tooltip.component';
import { CustomDateComponent } from '@cyncCommon/component/custom-datepicker/custom-date-component.component';
import { CustomGridModel } from '@cyncCommon/component/custom-grid/custom-grid.model';

import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, FormControlName } from '@angular/forms';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-list-queue',
  templateUrl: './list-queue.component.html',
  styleUrls: ['./list-queue.component.scss']
})
export class ListQueueComponent implements OnInit {
  listCreditQueueModel: CustomGridModel;
  private gridApi;
  public gridOptions: GridOptions;
  public rowData: any = [];
  public columnDefs: any[];
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  @ViewChild('op1', { read: ElementRef }) op1: ElementRef;
  isNew: boolean;
  gridData: any;
  namingOfTab: string = "Add New";
  getStatusDropdown: any = [];
  statusValue: any = "--Filter by Status--";
  fromDate: any = [];
  toDate: any = [];
  getCommentHistory: AllCreditQueue;
  frameworkComponents;
  defaultColDef: any;
  components;
  rowBuffer;
  rowSelection;
  rowModelType;
  paginationPageSize;
  cacheOverflowSize;
  maxConcurrentDatasourceRequests;
  infiniteInitialRowCount;
  maxBlocksInCache;
  dataSource: any;
  gridColumnApi: any;
  filterForm: FormGroup;
  monthStartDay: Date;
  monthEndDay: Date;
  todaysDate: Date;
  isAddPermitted: boolean;
  isDeletePermitted: boolean;
  isEditPermitted: boolean;

  constructor(private _apiMapper: APIMapper,
    private _helper: Helper,
    private _commonAPIs: CommonAPIs,
    private _message: MessageServices,
    private _creditQueueService: CreditQueueService,
    private _router: Router, private _fb: FormBuilder) {

    this.gridOptions = <GridOptions>{
      columnDefs: this.columnDefs,
      rowData: this.rowData,
    };

    this.columnDefs = [
      {
        headerName: 'Request Number', field: 'request_no', sortable: true, filter: 'agNumberColumnFilter'
      },
      {
        headerName: 'Request Date', field: 'created_at', sortable: true, width: 300,
        filter: "agDateColumnFilter",
        valueFormatter: function(params) {
          var dateParts = params.value.split("/");
          var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
          return moment(cellDate).format('L');
      },
        filterParams: {
          comparator: function (filterLocalDateAtMidnight, cellValue) {
            var dateAsString = cellValue;
            var dateParts = dateAsString.split("/");
            var cellDate = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
            if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
              return 0;
            }
            if (cellDate < filterLocalDateAtMidnight) {
              return -1;
            }
            if (cellDate > filterLocalDateAtMidnight) {
              return 1;
            }
          }
        },
        // cellRenderer: function(data) {
        //   //    return moment(data.value).format('L');
        //       return moment(new Date(data.value)).format('MM/DD/YYYY');
        //   },
      },
      { headerName: 'Requested By', field: 'user_name', sortable: true, filter: 'agTextColumnFilter', tooltipField: 'user_name' },
      {
        headerName: 'Client', field: 'borrower_name', sortable: true, filter: 'agTextColumnFilter',
        cellStyle: { color: 'blue', cursor: 'pointer' }, tooltipField: 'borrower_name', tooltipComponentParams: { color: "#ececec" }, width: 200
      },
      {
        headerName: 'Debtor', field: 'customer_name', sortable: true, filter: 'agTextColumnFilter',
        cellStyle: { color: 'blue', cursor: 'pointer' }, tooltipField: 'customer_name', width: 200
      },
      {
        headerName: 'Current Limit', field: 'current_limit', sortable: true, filter: 'agNumberColumnFilter',
        cellStyle: { textAlign: 'right' },
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Requested Limit', field: 'requested_limit', sortable: true, filter: 'agNumberColumnFilter',
        cellStyle: { textAlign: 'right' },
        cellRenderer: this.CurrencyCellRenderer
      },
      {
        headerName: 'Approved Limit', field: 'approved_limit', sortable: true, filter: 'agNumberColumnFilter',
        cellStyle: { textAlign: 'right' },
        cellRenderer: this.CurrencyCellRenderer
      },
      { headerName: 'Status', field: 'status', sortable: true, filter: 'agTextColumnFilter', width: 120, },
      { headerName: 'Comment', field: 'comment', sortable: true, filter: 'agTextColumnFilter', tooltipField: 'comment', width: 200 },
      {
        headerName: "Actions",
        suppressMenu: true,
        suppressSorting: false,
        cellClass: 'action-class',
        width: 120,
        template:
          `<i class="fa fa-pencil-square-o" aria-hidden="true" data-action-type="view" pTooltip="Edit Queue" tooltipPosition="top"></i> 
          &nbsp; <i class="fa fa-info-circle" aria-hidden="true" data-action-type="history"  pTooltip="View Comment History" tooltipPosition="top"></i>`
      }
    ];
    this.defaultColDef = {
      enableValue: true,
      sortable: true,
      tooltipComponent: "customTooltip",
      resizable: true
    };
    this.frameworkComponents = { customTooltip: CustomTooltip, agDateInput: CustomDateComponent };
    this.components = {
      loadingRenderer: function (params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return false;
        }
      }
    };
    this.rowBuffer = 0;
    this.rowSelection = "multiple";
    this.paginationPageSize = 50;
    this.cacheOverflowSize = 2;
    this.maxConcurrentDatasourceRequests = 1;
    this.infiniteInitialRowCount = 50;
    this.maxBlocksInCache = 2;
    this.gridOptions.datasource = this.dataSource;
  }

  ngOnInit() {
    this.getStatusValue();
    this.buildForm();
    this.todaysDate = new Date();
    var nowdate = new Date();
    let monthStartDay = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
    this.filterForm.controls['fromDate'].setValue(monthStartDay);
    this.filterForm.controls['toDate'].setValue(this.todaysDate);
    this.filterForm.controls['statusValue'].setValue(1);
    //  this.getPermissions();
  }

  dateFormatter(params) {
    console.log("param",params);
    return moment(params.value).format('MM/DD/YYYY');
  }

  /**
   *  Creating Form Group
   */
  buildForm() {
    this.filterForm = this._fb.group({
      statusValue: new FormControl(['']),
      fromDate: new FormControl(['']),
      toDate: new FormControl([''])
    });
  }

  /**
   * binding data to ag-grid table
   * @param params 
   */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
    this.renderList();
  }

  /**
   * formating string to number column with two decimal numbers
   * @param params 
   */
  private CurrencyCellRenderer(params: any) {
    var usdFormate = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2
    });
    return usdFormate.format(params.value);
  }

  /**
   * submit filter form
   * @param value 
   * @param isvalid 
   */
  onFilerBy(value, isvalid) {
    let d = new Date(Date.parse(value.fromDate));
    value.fromDate = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    let date = new Date(Date.parse(value.toDate));
    value.toDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    if (value.fromDate == "NaN-NaN-NaN") {
      value.fromDate = "";
    }
    if (value.toDate == "NaN-NaN-NaN") {
      value.toDate = `${this.todaysDate.getFullYear()}-${this.todaysDate.getMonth() + 1}-${this.todaysDate.getDate()}`;
    }

    if(value.statusValue == ""){
      value.statusValue="";
    }else{
      value.statusValue=parseInt(value.statusValue);
    }
    console.log("value", value);
    this._message.showLoader(true);
    let model = {
      "status":  value.statusValue,
      "from_date": value.fromDate,
      "to_date": value.toDate
    }
    const url = this._apiMapper.endpoints[CyncConstants.CREDIT_QUEUE_LIST] + '/filter';
    this._creditQueueService.getFilteredData(url, model).subscribe(res => {
      this.rowData = res.request_list;
      this._message.showLoader(false);
    });
  }


  /**
   * Identify action clicked on grid row i.e view or history
   * @param e 
   */
  public onRowClicked(e) {
    if (e.event.target !== undefined) {
      let data = e.data;
      let actionType = e.event.target.getAttribute("data-action-type");

      switch (actionType) {
        case "view":
          this.namingOfTab = "Edit Queue";
          return this.onActionViewClick(data);
        case "history":
          return this.onActionHistoryClick(data);
      }
    }
  }

  /**
   * Identify cell clicked i.e ascolumn name
   * @param e 
   */
  public onCellClicked(e) {
    if (e.colDef.field == "customer_name") {
      this._message.showLoader(true);
      const url = this._apiMapper.endpoints[CyncConstants.DEBTOR_POPUP_LIST].replace('{id}', e.data.customer_id).replace('{borrower_id}', e.data.borrower_id);
      this._creditQueueService.getCreditQueueDebtorValues(url).subscribe(res => {
        const popupParam = { 'title': 'Debtor Details', 'message': res, 'msgType': 'success' };
        this._helper.openInformationPopup(popupParam);
        this._message.showLoader(false);
      });
    }
    if (e.colDef.field == "borrower_name") {
console.log(e.data);
      this._message.showLoader(true);
      const url = this._apiMapper.endpoints[CyncConstants.CLIENT_POPUP_LIST].replace('{id}', e.data.borrower_id);
      this._creditQueueService.getCreditQueueValues(url).subscribe(res => {
        const popupParam = { 'title': 'Client Details', 'message': res, 'msgType': 'success' };
        this._helper.openInformationPopup(popupParam);
        this._message.showLoader(false);
      });
    }
  }

  /**
   * get status values
   */
  getStatusValue() {
    const url1 = this._apiMapper.endpoints[CyncConstants.STATUS_DROPDOWN_VALUES];
    this._creditQueueService.getCreditQueueValues(url1).subscribe(res => {
      this.getStatusDropdown = res;
      this._message.showLoader(false);
    });
  }


/**
 * redirect to edit screen once clicked on view icon
 * @param data 
 */
  public onActionViewClick(data: any) {
    this.isNew = true;
    setTimeout(() => {
      this.staticTabs.tabs[1].active = true;
    }, 100);
    CyncConstants.setRowDataCreditQueue(data);
  }

/**
 * display comment history on click on history icon
 * @param data 
 */
  public onActionHistoryClick(data: any) {
    const url1 = this._apiMapper.endpoints[CyncConstants.COMMENT_HISTORY].replace('{id}', data.request_no);
    this._creditQueueService.getCreditQueueValues(url1).subscribe(res => {
      const popupParam = { 'title': 'Edit History', 'message': res, 'msgType': 'success' };
      this._helper.openCommentHistoryPopup(popupParam);
      this._message.showLoader(false);
    });
  }

/**
 * reset filter form
 */
  reset() {
    var nowdate = new Date();
    let monthStartDay = new Date(nowdate.getFullYear(), nowdate.getMonth(), 1);
    this.filterForm.controls['fromDate'].setValue(monthStartDay);
    this.filterForm.controls['toDate'].setValue(this.todaysDate);
    this.filterForm.controls['statusValue'].setValue(1);
    this.renderList();
  }

  /**
   * function to reload grid
   */
  renderList() {
    this.filterForm.get('statusValue').setValue(1);
    this._message.showLoader(true);
    let url = this._apiMapper.endpoints[CyncConstants.CREDIT_QUEUE_LIST];
    // url = url.replace('{pageNumber}', 1);
    //	url = url.replace('{numOfRows}', '10');
    this._creditQueueService.getCreditQueueValues(url).subscribe(res => {
      this.rowData = res.request_list;
      this._message.showLoader(false);
    });
  }

  /**
* Get Permissions for CreditQueue
*/
  // getPermissions() {
  // 	let userRoleId = localStorage.getItem('cyncUserRoleId');/*Logged In User*/
  // 	let roleType = localStorage.getItem('cyncUserRole');
  // 	if (!this._helper.compareIgnoreCase(roleType, CyncConstants.ADMIN_ROLE_TYPE)) {
  // 		this._commonAPIs.getUserPermission(this.listCreditQueueModel.menuName, userRoleId).subscribe(permissions => {
  // 			this.isAddPermitted = this._helper.getAddPermission(permissions);
  // 			this.isDeletePermitted = this._helper.getDeletePermission(permissions);
  // 			this.isEditPermitted = this._helper.getEditPermission(permissions);
  // 			this.renderList();
  // 		});
  // 	} else {
  // 		this.isAddPermitted = true;
  // 		this.isDeletePermitted = true;
  // 		this.isEditPermitted = true;
  // 		this.renderList();
  // 	}
  // }

  /**
   * function to redirect to add tab
   */
  selectTab(tabId: number) {
    this.isNew = true;
    this.namingOfTab = "Add New";
    setTimeout(() => {
      this.staticTabs.tabs[tabId].active = true;
    }, 100);
  }
}
