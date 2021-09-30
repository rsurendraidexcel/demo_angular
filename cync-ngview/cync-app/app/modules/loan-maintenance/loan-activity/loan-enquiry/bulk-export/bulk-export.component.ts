import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { FromToDateSearchModel } from '@cyncCommon/component/from-to-date-search/from-to-date-search.model';
import { LoanEnquiryService } from '../loan-enquiry.service';
import { param } from 'jquery';
import * as moment from 'moment-timezone';
import { BulkExportDownloadComponent } from './bulk-export-download/bulk-export-download.component';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { GridOptions } from 'ag-grid-community';


@Component({
  selector: 'app-bulk-export',
  templateUrl: './bulk-export.component.html',
  styleUrls: ['./bulk-export.component.scss']
})
export class BulkExportComponent implements OnInit, AfterViewInit, OnDestroy {

  showDateRangeApp: boolean = false;
  from_date: any;
  to_date: any;
  fromToDateSearchModel: FromToDateSearchModel;
  gridApi1;
  bulkexportrowData;
  frameworkComponents: any;
  current_date:any;
  myMessege: any;
  roleObjAll = true;
  roleObjDate = false;

  constructor(
    private _message: MessageServices,
    private _loanEnquiryService: LoanEnquiryService,
    private _helper: Helper,
  ) {
    this.fromToDateSearchModel = {
      'type': "loan-inquiry",
      'from_date': null,
      'to_date': null
    };
  
    this.current_date = new Date(this._helper.convertDateToString(new Date()));
   }
//    @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    
//     return false
// }

  ngOnInit() {
  //   this.bulkexportrowData =  [
  //     { sl_no: 1, requsted_date: '05/05/2019', requsted_by: 'user 1', status: 'pending' },
  //     { sl_no: 2, requsted_date: '05/04/2019', requsted_by: 'user 2', status: 'completed' },
  //     { sl_no: 3, requsted_date: '05/03/2019', requsted_by: 'user 3', status: 'completed' },
  //     { sl_no: 4, requsted_date: '05/02/2019', requsted_by: 'user 4', status: 'completed' }
  // ];
  this.getUserHistoryData();
  }

  ngAfterViewInit() {
    $(".module-sub-menu").hide();
    $(".alert").hide();

    // window.onbeforeunload = function() {
    //   return false;
  // }
  }
  ngOnDestroy() {
    $(".module-sub-menu").show();
  }

  

  changeRange(event){
    
    if(event.target.value === "daterange"){
      this.showDateRangeApp = true;
    }
    else if(event.target.value === "All"){
      this.showDateRangeApp = false;
    }
  }

  bulkExportGridReady(params: any) {
		this.gridApi1 = params.api;
		params.api.sizeColumnsToFit();
  }
  
  defaultColDef = {
		editable: false,
		filter: "agTextColumnFilter"
	}

  bulkExportcolumnDefs = [
    {
      headerName: "Sl No.",
      valueGetter: "node.rowIndex + 1",
      width: 100
    },

		{
			headerName: 'Request Date',
			field: 'date_requested',
			width: 400,
			sortable: true
		},
		{
			headerName: 'Requested By', field: 'requested_by', width: 400, sortable: true,
      filter: 'agTextColumnFilter',
		},
		{
			headerName: 'Status', field: 'status', width: 200, sortable: true,
      filter: 'agTextColumnFilter', cellRenderer: (params)=>{

        if(params.value === "Completed"){
          return "<p style='color:green'> Completed </p>";
        }
        else if(params.value === "InProgress"){
          return "<p style='color:black'> In Progress </p>";
        }
        else if(params.value === "Error"){
          return "<p style='color:red'> Error.Please Place another order</p>";
        }
      },
    },
    {
			headerName: 'Download File', field: 'file', width: 200, sortable: true,
      filter: 'agTextColumnFilter',
      cellRendererFramework: BulkExportDownloadComponent,
		}
  ];
  
getUserHistoryData(){
  this._message.showLoader(true);
  let url = 'loan_inquery/bulk_export_for_loan_inquiry_data';
  this._loanEnquiryService.getBulkExportHistory(url).subscribe(response =>{
    
    this.bulkexportrowData = response;
    this._message.showLoader(false);
  })
}


fromDateSelectMethod(event){

//this.from_date = moment(event).format('MM-DD-YYYY');
}

toDateSelectMethod(event){
  
  //this.to_date = moment(event).format('MM-DD-YYYY');
}

onClickAssignGenerateDate(){
    if(!this.from_date || !this.to_date){
//  if(this.from_date === undefined || this.to_date === undefined || this.from_date === '' || this.to_date === ''){
  this._helper.showApiMessages("Effective Date fields should not be blank", 'warning');
  return false;
 }
 else{
   var toDate = moment(this.to_date).format('MM-DD-YYYY');
   var fromDate = moment(this.from_date).format('MM-DD-YYYY');
 }

 var dateComparison = moment(toDate).isSameOrAfter(fromDate, 'day');
 
 if(dateComparison === false){
  //  if(this.from_date === undefined || this.to_date === undefined || this.from_date === '' || this.to_date === ''){
    this._helper.showApiMessages("To date should be greater than from date", 'warning');
    return false;
   }

  this._message.showLoader(true); 


  let url = 'loan_inquery/list_data_for_bulk_export';
  let params = `?from_date=${fromDate}&to_date=${toDate}`;
  url = url + params;
  this._loanEnquiryService.getBulkExportRequest(url).subscribe(response =>{

    $("#successMsg").stop(true).fadeTo(200,1);
    
    this.myMessege = 'File generation request placed, To know status please see Status column below.';
    // this._helper.showApiMessages("File generation request placed. To know status please see Status coloumn below.", 'success');
    $("#successMsg").fadeTo(15000, 500).slideUp(500, function(){
      $("#successMsg").slideUp(500);
  });
    this.getUserHistoryData();
    this.showDateRangeApp = false;
    $('#checkAll').prop('checked', true);
    $('#checkDate').prop('checked', false);
    this.to_date = null;
    this.from_date = null;
    this._message.showLoader(false);
    // this.roleObjAll = true;
    // this.roleObjDate = false;
    // this.from_date = '';
    // this.to_date = '';
  }, err =>{
         this._helper.showApiMessages("An error occurred", 'warning');
  })

}

gridOptions: GridOptions = {
  onGridReady: () => {
    this.gridOptions.api.sizeColumnsToFit();
  }
};

gridRefresh(){
  this.getUserHistoryData();
}

closeSuccessPOP(){
  $(".alert").hide();
}

onClickAssignGenerateAll(){
 
  
  this._message.showLoader(true);
 
  let url = 'loan_inquery/list_data_for_bulk_export?generate_all=true';
  
  this._loanEnquiryService.getBulkExportRequest(url).subscribe(response =>{
    $("#successMsg").stop(true).fadeTo(200,1);
    this.myMessege = 'File generation request placed, To know status please see Status column below.';
    // this._helper.showApiMessages("File generation request placed. To know status please see Status coloumn below.", 'success');
    $("#successMsg").fadeTo(15000, 500).slideUp(500, function(){
      $("#successMsg").slideUp(500);
  });

    this.getUserHistoryData();

    this._message.showLoader(false);
  }, err =>{
    this._helper.showApiMessages("An error occurred", 'warning');
})

}

}
