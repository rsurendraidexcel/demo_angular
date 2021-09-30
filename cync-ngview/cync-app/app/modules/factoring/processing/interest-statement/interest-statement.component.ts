import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { LoanSetupService } from '../../../loan-maintenance/loan-activity/loan-setup/service/loan-setup.service';
import { Helper } from '@cyncCommon/utils/helper';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment';
import { InterestStatementExportStyle } from '../model/interest-statement.model';
import { ProcessingService } from '../services/processing-service';
import { AdjustmentEntryComponent } from './adjustment-entry/adjustment-entry.component';
import { TransactionTypeLinkComponent } from './transaction-type-link/transaction-type-link.component';
import { FactoringInterestSetupService } from '@app/modules/client-maintenance/factoring-parameters/factoring-interest-setup/service/factoring-interest-setup.service';
import { data } from 'jquery';

interface RolesPermision {
  action: string;
  action_id: number;
  action_label: string;
  enabled: boolean;
  role_permission_id: number;
}
@Component({
  selector: 'app-interest-statement',
  templateUrl: './interest-statement.component.html',
  styleUrls: ['./interest-statement.component.scss']
})
export class InterestStatementComponent implements OnInit {

  cyncColumnDefs: any;
  defaultColDef: any;
  frameworkComponents: any;
  interestStatementForm: FormGroup;
  interestStatementGridOptions: GridOptions;
  // paginationPageSize: number;
  public excelStyles: any;
  cyncRowData: any;
  rowDataToBeFiltered: any;
  currentDate: Date;
  to_date: string;
  from_date: string;
  fmax_date: Date;
  tomax_date: Date;
  max_date: any;
  clientId: any;
  cyncGridColumnApi: any;
  cyncGridGridApi: any;
  userAndClient: any;
  interestStatementRolePermission: RolesPermision[];
  interestFrequency: any;
  hideZeroTransactionrecords:boolean = true;
  recalculationMsg : string;
  infoTooltip: boolean = false;
  interestSetupAvailability:boolean = false;
  rolesAndPermissionAvailability:boolean = false;
  interval:any;
  interestChargeEditable: boolean;
  selectedRows: number;
  selectedHeaderColumnGrid: any[]; 
  @ViewChild('checkbox_input') checkbox_input: ElementRef;

  
  constructor(private fb: FormBuilder, private helper: Helper,
    private processingservice: ProcessingService,
    private router: Router,
    private message: MessageServices,
    private loanSetupService: LoanSetupService,
    public dialog: MatDialog,
    private _message: MessageServices,
    private factoringInterestService: FactoringInterestSetupService) {

    this.cyncRowData = [];
    //this.paginationPageSize=100;
    this.frameworkComponents = {
      agDateInput: CustomDatePickerComponent
    };
    this.defaultColDef = {
      filter: 'agNumberColumnFilter',
      resizable: true,
      sortable: true,
      minWidth: 150,
      width: 130,
      maxWidth: 250

    };
    this.interestStatementGridOptions = {
      floatingFilter: false,
      headerHeight: 50,
      enableBrowserTooltips: true,
      paginationPageSize: 250,
      rowSelection: "multiple",
      pagination: true,
      context: {
        componentInterestStatment: this
      },

    };

    this.excelStyles = InterestStatementExportStyle.setGridExportStyle();

    this.createInterestStatementForm();
    // Obervale for clients and userDetails
    this.userAndClient = CyncConstants.getUserInfo();
    this.helper.getSelectedUserAndClient().subscribe(data => {
      this.userAndClient = data;
      if (this.userAndClient === undefined) {
        this.router.navigateByUrl(window.origin + "/#/");
      } else {
        if (this.userAndClient.clientDetails.processng_type === "ABL") {
          window.location.href = window.origin;
        }
      }
    });

  }

  ngOnInit() {
    this.currentDate = new Date();
    this.currentDate.setMonth(this.currentDate.getMonth() - 6);
    let timeZone = CyncConstants.getLenderTimezone();
    this.to_date = moment(this.interestStatementForm.get('to_activity_date').value).tz(timeZone).format("MM/DD/YYYY");
    this.from_date = moment().startOf('month').format("MM/DD/YYYY");
    this.clientChangeLoadInterestStatement();
    // this.from_date = moment(this.currentDate).tz(timeZone).format("MM/DD/YYYY");
    this.initializeLenderTimezone();
    this.getloanSetupRolesPermission();
    this.summaryPermission();
    

    
    this.processingservice.getRefresh().subscribe(data =>{
      if(data === 'process'){
       this.interval = setInterval( () => { 
          this.onRecalculationJobStatus(); 
        },3000);
      }
    })
  }

  ngAfterViewInit() {
    //  this.setScrollbar();
  }

  columnGridChanged(event:any){
    let payLoad = {
      header_columns: [{"field": event.column.colDef.field,
                    "displayValue": event.column.colDef.headerName,
                    "visible": event.visible,  
                  }],
                  client_id:`${this.clientId}` ,
                  user_id:`${localStorage.getItem("cyncUserId")}`,
                  start_date: `${this.from_date}`,
                  end_date: `${this.to_date}`
                };
    let url = `factoring/interest/grid_config/update_interest_inquiry`;
    if(event.visible===true){
      this.processingservice.postService(url,payLoad).subscribe(resp =>{
        this.cyncGridGridApi.refreshCells();
      })
    }
    // if(event.visible===false){
    //   if(event.column.colId === "transactionDate" || event.column.colId === "transactionType" || event.column.colId === "transactionAmount"
    //   )
    //   {
    //     this.helper.showApiMessages("Freeze Columns are not hide and saving, only runtime can visible and hide", 'danger');
    //     return false;
    //   }else{
    //       this.processingservice.postService(url,payLoad).subscribe(resp =>{
    //       this.cyncGridGridApi.refreshCells();
    //     })
    //   }
    // }
    if(event.visible===false){
      this.processingservice.postService(url,payLoad).subscribe(resp =>{
        this.cyncGridGridApi.refreshCells();
      })
    }
  }


  gridColumnInialysation(){
      let url = `factoring/interest/grid_config/get_interest_inquiry?client_id=${this.clientId}&user_id=${localStorage.getItem("cyncUserId")}`;
      this.processingservice.getService(url).subscribe(res =>{
          this.selectedHeaderColumnGrid = res.header_columns;
          this.interestStatementLoadData();
      },(error) => {
        if(error.status === 400 ){
         this.interestSetupAvailability = true;
         this.interestStatementLoadData();

        } 
      });
  }

  getloanSetupRolesPermission() {
    const userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);
    const url = `roles/${userRoleId}/role_permissions/menu_specific_permissions?menu_name=factoring_interest_statement`;
    this.loanSetupService.getService(url).subscribe(resp => {
      let temRoleData = <RolesPermision[]>JSON.parse(resp._body);
      this.interestStatementRolePermission = temRoleData;
      console.log("Roles:", this.interestStatementRolePermission);
    });
  }

  checkRolsPermission(action: string): boolean {
    let result: boolean;
    if (this.interestStatementRolePermission !== undefined) {
      this.interestStatementRolePermission.forEach(el => {
        if (el.action_label === action) {
          result = el.enabled;
        }
      });
    }
    return result;
  }

  summaryPermission() {
    if (this.checkRolsPermission('Summary') === false) {
      window.location.href = window.origin + "/factoring/dashboard";
      console.log("route to dashboard");
    }

  }

  initializeLenderTimezone() {
    let timeZone = CyncConstants.getLenderTimezone();
    let fmaxdate = moment(new Date(), CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone()).format("MM/DD/YYYY");
    let tomaxdate = moment(new Date(), CyncConstants.DATE_FORMAT).tz(CyncConstants.getLenderTimezone()).endOf('month').format("MM/DD/YYYY");

    this.fmax_date = new Date(fmaxdate);
    this.tomax_date = new Date(tomaxdate);
    // this.from_date = moment().startOf('month').format("YYYY-DD-MM");
    // this.from_date = moment(this.currentDate).tz(timeZone).format("MM/DD/YYYY");
  }

  interestStatementLoadData() {
    let thatref = this;
    let timeZone = CyncConstants.getLenderTimezone();
    let to_date = moment(new Date()).tz(timeZone).format("MM/DD/YYYY");
    let from_date = moment(new Date()).subtract(90,'d').format("MM/DD/YYYY");
    let url = `factoring/interest/charge_statements?client_id=${this.clientId}&start_date=${from_date}&end_date=${to_date}`;

    this.processingservice.getInterestStatement(url).subscribe(resdata => {
      let tempdata = resdata.length===0 ? resdata : resdata.data;
      this.selectedRows=tempdata.length;      
      this.interestFrequency = resdata.interest_frequency;
      if (tempdata === undefined || tempdata.length === 0) {
        tempdata = [];
        this.cyncRowData = tempdata;
        this.rowDataToBeFiltered = tempdata;
        console.log("this.rowDataToBeFiltered", this.rowDataToBeFiltered)
        // this.createColDef(resdata.header_columns);
        this.createColDef(this.selectedHeaderColumnGrid);
        this.message.showLoader(false);
        // thatref.helper.openAlertPoup("Message", "Factoring Interest setup is not enabled for this client");
      }
      if (tempdata.length > 0) {
        this.cyncRowData = tempdata;
        this.rowDataToBeFiltered = tempdata;
        this.hideAndShowZeroTransactionRows(tempdata);
        // this.createColDef(resdata.header_columns);
        this.createColDef(this.selectedHeaderColumnGrid);
        this.message.showLoader(false);
      }
      thatref.interestSetupCheck();
      this.rolesAndPermissionAvailability = false;
    }, (error) => {
      if (error.status === 403) {
        this.rolesAndPermissionAvailability  = true;
        this.message.showLoader(false);
      }
    });


  }

  loadGridData(){
    this.message.showLoader(true);
    // this.interestStatementLoadData();
    this.gridColumnInialysation();
    this.onSearchButtonClickEvent();
  }

  //this method only for check the interest setup
   interestSetupCheck() {
     this.factoringInterestService.getInterestSetupData(this.clientId).subscribe(data => {
     if (data[0].interest_to_be_charged === true){
      this.interestSetupAvailability = false;
     }else{
      this.interestSetupAvailability = true;
     }

    }, (error) => {
      if(error.status === 400 ){
       this.interestSetupAvailability = true;
       console.log("interest statement setup is not done");
      } 
    });
  }

 // This method Call After getFactoringInterestSetUpShowData Fails only
 clientChangeLoadInterestStatement() {
    this.helper.getClientID().subscribe((d) => {
      this.clientId = d;
      this.gridColumnInialysation();
      this.defaultSetFromDateToDate();
      this.message.showLoader(true);
    });

  }

  /**
   * On Grid Ready Method
   * @param event 
   */
  cyncGridReady(params: any) {
    console.log("Grid is loaded..");
    this.cyncGridColumnApi = params.columnApi;
    this.cyncGridGridApi = params.api;
    this.cyncGridGridApi.showLoadingOverlay();
    // this.interestStatementLoadData();
    console.log("cyncGridColumnApi",this.cyncGridColumnApi);
  }

  createInterestStatementForm() {
    let timeZone = CyncConstants.getLenderTimezone();
    this.interestStatementForm = this.fb.group({
      'from_activity_date': [moment(new Date()).subtract(90,'d').format("MM/DD/YYYY")],
      'to_activity_date': [moment(new Date()).tz(timeZone).format("MM/DD/YYYY")],
    });

  }

  defaultSetFromDateToDate() {
    let timeZone = CyncConstants.getLenderTimezone();
    this.from_date = moment(new Date()).subtract(90,'d').format("MM/DD/YYYY");
    this.to_date = moment(new Date()).tz(timeZone).format("MM/DD/YYYY");
    this.interestStatementForm.get(`to_activity_date`).setValue(this.to_date);
    this.interestStatementForm.get(`from_activity_date`).setValue(this.from_date);
  }


  /**
  * Date range search button click event
  * @param type 
  */
  onSearchButtonClickEvent() {
    this.message.showLoader(true);
    let fromDateValue = moment(this.interestStatementForm.get('from_activity_date').value).format("MM/DD/YYYY");
    let toDateValue = moment(this.interestStatementForm.get('to_activity_date').value).format("MM/DD/YYYY");
    this.to_date = toDateValue;
    this.from_date = fromDateValue;
    let url = `factoring/interest/charge_statements?client_id=${this.clientId}&start_date=${fromDateValue}&end_date=${toDateValue}`;
    this.processingservice.getService(url).subscribe(resdata => {
      let tempdata = resdata.data;
      this.rowDataToBeFiltered = tempdata;
      this.createColDef(this.selectedHeaderColumnGrid);
      this.cyncRowData = tempdata;
    
      // $('#checkbox').prop('checked', true);
      
        this.hideAndShowZeroTransactionRows(tempdata);
     
      
      this.message.showLoader(false);
    })
  }

  onRecalculationJobStatus() {
    let url =`factoring/interest/job_process_status?client_id=${this.clientId}`;
    this.processingservice.getService(url).subscribe(resdata => {
      let tempdata = resdata;
        if(tempdata.status===200){
          this.recalculationMsg='';
         this.loadGridData();
         clearInterval(this.interval);
        }else if(tempdata.status===201){
          this.recalculationMsg = tempdata.success.message;
        }
      });
  }

  getDateFormater(inputDate: any): string {
    return moment(inputDate.value, "MM-DD-YYYY").format(CyncConstants.DATE_FORMAT);
  }


  /**
 * Currency formating function
 * @param params 
 */
  currencyFormater(params) {
    var usdFormate = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2
    });
    let usdFormatedValue = usdFormate.format(params.value === undefined ? params : params.value);
    if (usdFormatedValue.indexOf('-') !== -1) {
      return "(" + usdFormatedValue.replace('-', '') + ")";
    } else {
      return usdFormatedValue;
    }
  }



  // Create the hash object Methods.
  createColDef(colList: any) {
    const list: any = [];
    if (colList) {
      for (const col of colList) {
        if (col.field === "interestChargeableOpeningBalance") {
          list.push({
            headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign",
            cellStyle: { textAlign: 'right' },
            valueFormatter: this.helper.currencyFormateSixDecimal,
            hide: !col.visible
          });
        } else if (col.field === "funding") {
          list.push({
            headerName: col.displayValue,
            field: col.field, colType: 'currency',
            cellClass: "exportRightAllign",
            cellStyle: { textAlign: 'right'},
            hide: !col.visible,
            valueFormatter: this.helper.currencyFormateSixDecimal
          });
        } else if (col.field === "transactionAmount") {
          list.push({
            headerName: col.displayValue,
            field: col.field,
            pinned: 'left',
            cellStyle: { textAlign: 'right' }, cellClass: "exportRightAllign",
            valueFormatter: this.helper.currencyFormateSixDecimal,
            hide: !col.visible
          });
        } else if (col.field === "reserveDeductions") {
          list.push({
            headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign",
            cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, 
            hide: !col.visible
          });
        } else if (col.field === "interestOnBalance") {
          list.push({
            headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign",
            cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal,
            hide: !col.visible
          });
        } else if (col.field === "interestRate") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "netInterestPayable") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "paymentsChargebackRecourse") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "interestChargeableClosingBalance") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "cumulativeInterestAmount") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "cumulativeFundingBalance") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "cumulativeReserveDeductions") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "interestAccured") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "cumulativeFunding") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "cumulativePayments") {
          list.push({ headerName: col.displayValue, field: col.field, cellClass: "exportRightAllign", cellStyle: { textAlign: 'right' }, width: 200, valueFormatter: this.helper.currencyFormateSixDecimal, hide: !col.visible });
        } else if (col.field === "transactionType") {
          list.push({
            headerName: col.displayValue,
            field: col.field,
            pinned: 'left',
            cellStyle: { textAlign: 'left' },
            filter: 'agTextColumnFilter',
            cellClass: "exportLeftAllign",
            cellRendererFramework: TransactionTypeLinkComponent,
            hide: !col.visible
          });
        } else if (col.field === "transactionDate") {

          list.push(
            {
              headerName: col.displayValue, field: col.field,
              pinned: 'left',
              valueFormatter: this.getDateFormater,
              hide: !col.visible,
              filter: 'agDateColumnFilter',
              cellClass: "exportLeftAllign",
              comparator: function (valueA, valueB, nodeA, nodeB, isInverted) {
                try{
                  var dateA = moment(valueA).format('MM/DD/YYYY');
                  var dateB = moment(valueB).format('MM/DD/YYYY');

                  if(dateA == dateB){
                    let seqA = nodeA.data.sequence;
                    let seqB = nodeB.data.sequence;
                    if(seqA > seqB){
                      return 1;
                    }else if(seqA < seqB){
                      return -1;
                    }else{
                      return 0
                    }
                  }else if(dateA > dateB){
                     return 1;
                  }else{
                    return -1;
                  }
                }catch(err){
                  console.log(err);  
                } 
              }
            });

        } else {
          list.push({ headerName: col.displayValue, field: col.field, filter: 'agTextColumnFilter', cellClass: "exportRightAllign", hide: !col.visible });
        }
      }
      this.cyncColumnDefs = list;
      this.cyncColumnDefs.forEach(element => {
        if (element.field === "interestChargeableOpeningBalance" || element.field === "interestChargeableClosingBalance" || element.field === "cumulativeReserveDeductions" || element.field === 'cumulativeInterestAmount' || element.field === "cumulativeFundingBalance" || element.field === "interestRate") {
          element.minWidth = 200;
          element.width = 200;
          element.maxWidth = 310;
        }
      });
    }
  }


  onClickAdjustmentEntry() {
    const dialogRef = this.dialog.open(AdjustmentEntryComponent, {
      panelClass: 'full-width-dialog-invoice',
      height: "390px",
      width: "540px",
      maxHeight: "390px",
      data: { clietID: this.clientId, user_info: this.userAndClient }
    });

    // After Closed Call the method
    dialogRef.afterClosed().subscribe(result => {
      let thisRef = this;
      //console.log("After Model Closed call reload data");
      if (AdjustmentEntryComponent.isReload) {
        setTimeout(() => {
          thisRef.onSearchButtonClickEvent();
        }, 300);
      }
    });

  }

  /**
**
  * This method export the file into excel format
  */
  exportData() {
    if(this.selectedRows < 7000){
    // Get array of ag-grid display header fields
    let gridHeaderKeys = [];
    (this.cyncGridColumnApi.getAllDisplayedColumns()).forEach((e, i) => {
      if (e.colId != undefined) {
        gridHeaderKeys.push(e.colId);
      }
    });
    let params = {
      columnKeys: gridHeaderKeys,
      fileName: `Interest Inquiry for ${this.userAndClient.clientDetails.client_name}`,
      rowHeight: 17,
      exportMode: 'xlsx',
      font: {
        size: 11,
      },
      headerRowHeight: 20,
      sheetName: `Interest Inquiry for ${this.userAndClient.clientDetails.client_name}`,
      customHeader: [
        [{
          styleId: "excelTitleHeader",
          data: {
            type: "String",
            value: "Interest Inquiry  ",
          },
          mergeAcross: 1
        }],
        [],
        [{
          styleId: "excelClient",
          data: {
            type: "String",
            value: `Client Name : ${this.userAndClient.clientDetails.client_name}`
          },
          mergeAcross: 1
        }
        ],
        [{
          styleId: "excelFromToDateHeader",
          data: {
            type: "String",
            value: `From Date : ${this.from_date}`,
            rowHeight: 16,
          }

        },
        {
          styleId: "excelFromToDateHeader",
          data: {
            type: "String",
            value: `To Date : ${this.to_date}`,
            rowHeight: 16,
            font: { size: 12 },
          }
        }],
        [],
      ]
    };

    if (gridHeaderKeys.length > 0) {
      this.cyncGridGridApi.exportDataAsExcel(params);
    }
    else {
      this.helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
    }
  }else{
		this.helper.showApiMessages("Cannot export rows greater than 7000.", 'danger');
	}
  }

  showZeroTransactionrecords(event) {
    if (event.target.checked) {
      this.hideZeroTransactionrecords = true;
      if(this.interestFrequency === 2){
      let filteredRowData = this.cyncRowData.filter(elm => {
        return (elm.transactionType != "Interest Holiday");
      });
      this.cyncRowData = filteredRowData;
    } else if(this.interestFrequency === 0){
      let filteredRowData = this.cyncRowData.filter(elm => {
        return (elm.transactionType != "No Transaction");
      });
      this.cyncRowData = filteredRowData;
    }
    } else {
      this.hideZeroTransactionrecords = false;
      this.cyncRowData = this.rowDataToBeFiltered;
    }
  }

  hideAndShowZeroTransactionRows(tempdata:any){
    if(this.hideZeroTransactionrecords){
  if(this.interestFrequency === 2){ 
    let filteredRowData = this.cyncRowData.filter(elm => {
      return (elm.transactionType != "Interest Holiday");
    });
    this.cyncRowData = filteredRowData;
  } else if(this.interestFrequency === 0){
      let filteredRowData = this.cyncRowData.filter(elm => {
        return (elm.transactionType != "No Transaction");
      });
      this.cyncRowData = filteredRowData;
    }  else {
      this.cyncRowData = tempdata;
    }
    } else{
      this.cyncRowData = tempdata;
    }
    if(this.interestFrequency==2 || this.interestFrequency==0){
      setTimeout(()=>{   this.checkboxClickEventEmitter(); }, 2000);
    }
  }

  checkboxClickEventEmitter(){
      const inputElement: HTMLInputElement = <HTMLInputElement> this.checkbox_input.nativeElement;
        if(!inputElement.checked === true){
          inputElement.click();
        }
    }
} 
