import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import * as moment from 'moment-timezone';
import { GridOptions } from 'ag-grid-community';
import { QuickbookService } from '../service/quickbook.service';
@Component({
  selector: 'app-abl-qb-invoice',
  templateUrl: './abl-qb-invoice.component.html',
  styleUrls: ['./abl-qb-invoice.component.scss']
})
export class AblQbInvoiceComponent implements OnInit {
  isInvoiceData: boolean = true;
  showGrid: boolean = false;
  clientId: any;
  qbInvoiceForm: FormGroup;
  userAndClient: any;
  cyncRowData: any;
  defaultColDef: any;
  lastImportDateShowHide: boolean = false
  cyncColumnDefs:any = [];
  qbInvoiceGridOptions: GridOptions;
  frameworkComponents: any;
  lastImportedDate: any;
  lastImportedTime: any;
  lastModifierDateTime: any;
  current_date:any;
  gridApi: any;
  paginationPageSize = 7;
  cyncGridConfig = {
    filterType: 'agTextColumnFilter',
    columnDefaultWidth: 170,
    checkboxSelection: true,

  };

  constructor(private fb: FormBuilder,
    private helper: Helper,
    private router: Router,
    private message: MessageServices,
    private qbService: QuickbookService) {

    //Initialize Grid Property
    this.cyncRowData=[];
    this.defaultColDef = {
      filter: 'agTextColumnFilter',
      resizable: true,
      sortable: true,
      minWidth: 180,
      width: 180,
      maxWidth :250
    };

    this.qbInvoiceGridOptions = {
      floatingFilter: false,
      headerHeight: 45,
      enableBrowserTooltips: true,
      context: {
        componentQbInvoice: this
      },
    };
  
    this.getUserAndClient();
    this.qbInitializeForm();
  }

  ngOnInit() {
   this.getLastModifierDateTime();

   this.helper.getClientID().subscribe((data) => {
    let cltid = data;
    if (cltid !== 'null') {
      this.clientId = data;
      this.getLastModifierDateTime();
    }
  });
  }
  getUserAndClient() {
    this.clientId = CyncConstants.getSelectedClient();
    // Obervale for clients and userDetails
    this.userAndClient=CyncConstants.getUserInfo();
    this.helper.getSelectedUserAndClient().subscribe(data => {
      this.userAndClient = data;
      this.clientId = this.userAndClient.clientDetails.id;
      console.log("UserInfo", this.clientId, this.userAndClient);
      if (this.userAndClient === undefined) {
        this.router.navigateByUrl(window.origin + "/#/");
      } else {
        if (this.userAndClient.clientDetails.processng_type === "Factoring") {
          window.location.href=window.origin+"/factoring/dashboard";
        }
      }
    });
  }

  qbInitializeForm() {
    this.qbInvoiceForm = new FormGroup({
      invoice_numbers: new FormControl(''),
      due_date_from: new FormControl(''),
      due_date_to: new FormControl(''),
      invoice_date_from: new FormControl(''),
      invoice_date_to: new FormControl(''),
      balance_amount_from: new FormControl(''),
      balance_amount_to: new FormControl(''),
      total_amount_from: new FormControl(''),
      total_amount_to: new FormControl(''),
      last_imported_time:new FormControl(''),
      //invoice_customer_name: new FormControl(''),
      //invoice_department_name: new FormControl(''),
      //invoice_custom_field1: new FormControl(''),
      //invoice_custom_field1_value: new FormControl(''),
      //invoice_custom_field2: new FormControl(''),
      //invoice_custom_field2_value: new FormControl('')
    });
  }

  qbClearForm() {
    this.qbInvoiceForm.reset();
    this.qbInvoiceForm.get('invoice_numbers').setValue('');
    this.qbInvoiceForm.get('due_date_from').setValue('');
    this.qbInvoiceForm.get('due_date_to').setValue('');
    this.qbInvoiceForm.get('invoice_date_from').setValue('');
    this.qbInvoiceForm.get('invoice_date_to').setValue('');
    this.qbInvoiceForm.get('balance_amount_from').setValue('');
    this.qbInvoiceForm.get('balance_amount_to').setValue('');
    this.qbInvoiceForm.get('total_amount_from').setValue('');
    this.qbInvoiceForm.get('due_date_from').setValue('');
    this.qbInvoiceForm.get('total_amount_to').setValue('');
    this.qbInvoiceForm.get('last_imported_time').setValue(false);
  }

  // Last Modify DateTime
  getLastModifierDateTime() {
    let url = `qb_uploads/last_imported_date_time?borrower_id=${this.clientId}`;
    this.qbService.getQbService(CyncConstants.FACTORING_HOST, url).subscribe(res => {
      this.lastModifierDateTime = res;
      let split = this.lastModifierDateTime.split('T');
      this.lastImportedDate = moment(split[0]).format('YYYY/MM/DD');
      this.lastImportedTime = moment(split[1], "HH:mm:ss").format("HH:mm");
      this.lastImportDateShowHide = true;
    }, (error) => {
      this.lastImportDateShowHide = false
      this.message.cync_notify("error", `Last imported invoice date time Api fails`, 3000);
    });
  }

  clearFormAction() {
    this.qbClearForm();
  }
  getQbInvoice() {
    this.message.showLoader(true);
    let url = `quickbooks/import_quickbook_invoices?borrower_id=${this.clientId}`;
    const invoiceNos = this.qbInvoiceForm.get('invoice_numbers').value;
    let invoiceNum = invoiceNos === '' ? [] : invoiceNos.split(",");

    let dueDateFrom = moment(this.qbInvoiceForm.get('due_date_from').value).format('MM/DD/YYYY');
    let dueDateTo = moment(this.qbInvoiceForm.get('due_date_to').value).format('MM/DD/YYYY');
    let invoiceDateFrom = moment(this.qbInvoiceForm.get('invoice_date_from').value).format('MM/DD/YYYY');
    let invoiceDateTo = moment(this.qbInvoiceForm.get('invoice_date_to').value).format('MM/DD/YYYY');

    let lastImportCheck= this.qbInvoiceForm.get('last_imported_time').value;

    // let due_datetime_from=moment(this.qbInvoiceForm.get('invoice_date_from').value, ["h:mm a"]).format("HH:mm");
    // let due_datetime_to=moment(this.qbInvoiceForm.get('invoice_date_to').value, ["h:mm a"]).format("HH:mm");
    // let invoice_datetime_from=moment(this.qbInvoiceForm.get('invoice_date_from',["h:mm a"]).format("HH:mm");
    // let invoice_datetime_to=moment(this.qbInvoiceForm.get('invoice_date_to').value, ["h:mm a"]).format("HH:mm");

    console.log("======", lastImportCheck);
    let paylodbody = {
      invoice_numbers: invoiceNum,
      due_date_from: dueDateFrom === 'Invalid date' ? '' : dueDateFrom,
      due_date_to: dueDateTo === 'Invalid date' ? '' : dueDateTo,
      invoice_date_from: invoiceDateFrom === 'Invalid date' ? '' : invoiceDateFrom,
      invoice_date_to: invoiceDateTo === 'Invalid date' ? '' : invoiceDateTo,
      balance_amt_from: this.qbInvoiceForm.get('balance_amount_from').value,
      balance_amt_to: this.qbInvoiceForm.get('balance_amount_to').value,
      total_amt_from: this.qbInvoiceForm.get('total_amount_from').value,
      total_amt_to: this.qbInvoiceForm.get('total_amount_to').value,
      due_datetime_from: '',
      due_datetime_to: '',
      invoice_datetime_from: '',
      invoice_datetime_to: '',
      last_imported_time: lastImportCheck===true ? this.lastModifierDateTime : ''
    };
   // console.log("====>", paylodbody);
    this.qbService.importQbInvoices(url, paylodbody).subscribe(response => {
      this.message.showLoader(false);
      const tempResponse = response;
      //console.log("==>", tempResponse);
      this.qbImportInvoiceColDefs(tempResponse.header);
      this.showGrid = true;
      if (tempResponse.records.length > 0) {
        this.isInvoiceData = false;
        this.cyncRowData = tempResponse.records;
      }else{
        this.cyncRowData = tempResponse.records;
      }
      this.getLastModifierDateTime();

    });

  }

  // Column Initialization
  qbImportInvoiceColDefs(colList: any) {
    let coldefList: any = [];
    if (colList) {
      for (const qbCol of colList) {
          if(qbCol.colType==="string"){
          coldefList.push({ headerName: qbCol.headerName, field: qbCol.field, cellStyle: { textAlign: 'left' } });
          }else if(qbCol.colType==="currency"){
            coldefList.push({ headerName: qbCol.headerName, field: qbCol.field, colType: qbCol.colType, cellStyle: { textAlign: 'right' }, valueFormatter: this.helper.CurrencyCellRendererRoundOff });
          }else if(qbCol.colType==="datetime"){
            coldefList.push({ headerName: qbCol.headerName, field: qbCol.field, cellStyle: { textAlign: 'left' },
             filter: 'agTextColumnFilter'
            });
          }else if(qbCol.colType==="date"){
            coldefList.push({ headerName: qbCol.headerName, field: qbCol.field, cellStyle: { textAlign: 'left' }, colType: 'date',
        
            valueFormatter: this.getDateFormater,
            filterParams: {
              comparator: function (filterLocalDateAtMidnight, cellValue) {
                var dateAsString = moment(cellValue).format('DD/MM/YYYY');
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
            }
          }
          );

          }else{
            coldefList.push({ headerName: qbCol.headerName, field: qbCol.field, cellStyle: { textAlign: 'left' } });
          }
      }
      this.cyncColumnDefs = coldefList;
    }
  }

  cyncGridReady(params: any){
    this.gridApi= params.api;
    
  }

  // utile methods
  getDateFormater(inputDate: any ) : string {
    return moment(inputDate.value, "MM-DD-YYYY").format(CyncConstants.DATE_FORMAT);
   }

}
