import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment-timezone';
import { ImportQuickbookInvoiceService } from './import-quickbook-invoice.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Helper } from '@cyncCommon/utils/helper';
import { SelectItem } from 'primeng/api';
import { async } from '@angular/core/testing';

@Component({
  selector: 'app-import-quickbook-invoice',
  templateUrl: './import-quickbook-invoice.component.html',
  styleUrls: ['./import-quickbook-invoice.component.scss']
})
export class ImportQuickbookInvoiceComponent implements OnInit {

  @ViewChild('myform') myform: NgForm;
  @ViewChild('myform1') myform1: NgForm;
  enableGrid = true;
  gridApi: any;
  clientId: any;
  isInvoiceData: boolean = true;
  rowIsnotEmpty:boolean = true;
  display: boolean = false;
  gridColumnApi: any;
  lastModifierDateTime: any = '';
  showGrid: boolean = false;
  lastImportedDate: any;
  saved_field_mapping: any;
  lastImportedTime: any;
  valuePoNumber: any;
  counter:any;
  valuefileRefNumber:any;
  lastImportDateShowHide: boolean = false
  valuefeeName: any;
  current_date:any;
  cyncGridConfig = {
    filterType: 'agTextColumnFilter',
    columnDefaultWidth: 170,
    checkboxSelection: true,

  };
  cyncRowData: any = [];
  cyncColumnDefs: any = [];
  importQuicBook = {
    invoiceNumberFrom: '',
    invoiceNumberTo: '',
    report_date: '',
    dueDateFrom: '',
    dueDateTo: '',
    dueDateFromTime: '',
    dueDateToTime: '',
    invoiceDateFrom: '',
    invoiceDateTo: '',
    balanceAmountFrom: '',
    balanceAmountTo: '',
    totalAmountFrom: '',
    totalAmountTo: ''
  }

  ddlOptions: SelectItem[];
  PoNumber: SelectItem[];
  fileRefNumber: SelectItem[];
  feeName: SelectItem[];
  poNumberSelectedOption: any;
  fileNumberSelectedOption: any;
  fileNameSelectedOption: any;
  selectedOption: any;

  cyncGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();

  }

  constructor(private _service: ImportQuickbookInvoiceService,
    private _helper: Helper,
    private _message: MessageServices,) {
    this.clientId = CyncConstants.getSelectedClient();
    
    this.poNumberSelectedOption = 'please select'
    this.fileNumberSelectedOption = 'please select';
    this.fileNameSelectedOption = 'please select';
  }

  ngOnInit() {
    this.getLastModifierDateTime();

    this._helper.getClientID().subscribe((data) => {
      let cltid = data;
      if (cltid !== 'null') {
        this.clientId = data;
        this.getLastModifierDateTime();
      }
    });
  }

  showDialog() {
    this.display = true;
  }


  ngAfterViewInit() {
    $(".module-sub-menu").hide();
    $(".alert").hide();
  }

  getPopupData(form){
    let invoice_id_array = []
    let selectedRows = this.gridApi.getSelectedRows();
    
    if(selectedRows.length>0){
      if(form.valid){
      selectedRows.forEach(element => {
        invoice_id_array.push(element.invoice_id)
      });

      let invoice_id_array1 = invoice_id_array.map(elm => {
        return parseInt(elm)
      })
  
      // let invoice_ids = JSON.stringify(invoice_id_array1);
  
      // console.log(selectedRows);
      // console.log(form.value);
      this._message.showLoader(true);
      let url = `qb_uploads/create_qb_uploaded_file?borrower_id=${this.clientId}`
      let model = {
        po_number: form.value.poNumberSelectedOption,
        file_ref_number: form.value.fileNumberSelectedOption,
        fee_name: form.value.feeNameSelectedOption,
        invoice_ids: invoice_id_array1
      }
      this._service.qbImporttoCync(url, model).subscribe(response => {      
        this._message.showLoader(false);
        this._helper.showApiMessages("Imported successfully", 'success');
        this.display = false;
        this.isInvoiceData = true;
        this.myform.reset();
        this.showGrid = false;
        this.rowIsnotEmpty = true;
        
      });
    }
    else{
      this._helper.showApiMessages("Fee Name is required", 'warning');
    }
  }
    else{
      this._helper.showApiMessages("No row selected", 'warning');
      this.display = false;
    }

  
  }

  async getGridData(formInstance) {
    
    this._message.showLoader(true);
    
    this.showGrid = false;
    this.rowIsnotEmpty = true;
    this.cyncColumnDefs = [];
    this.cyncRowData = [];

    this.enableGrid = true;
    const res = { records: [] };
    // trigger service call
    let last_imported_time = '';
    let _dueDateFrom = '';
    let _dueDateTo = '';
    let _invoiceDateFrom = '';
    let _invoiceDateTo = '';
    let _dueDatetimeFrom = '';
    let _dueDatetimeTo = '';
    let _invoiceDatetimeFrom = '';
    let _invoiceDatetimeTo = '';
    let invoice_number_array1 = ''
    if(formInstance.value.invoice_numbers){
      let invoice_number_array = formInstance.value.invoice_numbers.split(',');
       invoice_number_array1 = invoice_number_array.map(elm => {
        return parseInt(elm)
      })
  
      // invoice_number = JSON.stringify(invoice_number_array1);
    }
   
    if (formInstance.value.dueDateFrom) {
      _dueDateFrom = moment(formInstance.value.dueDateFrom).format('MM/DD/YYYY')
    }
    if (formInstance.value.dueDateTo) {
      _dueDateTo = moment(formInstance.value.dueDateTo).format('MM/DD/YYYY')
    }

    if (formInstance.value.invoiceDateFrom) {
      _invoiceDateFrom = moment(formInstance.value.invoiceDateFrom).format('MM/DD/YYYY')
    }
    if (formInstance.value.invoiceDateTo) {
      _invoiceDateTo = moment(formInstance.value.invoiceDateTo).format('MM/DD/YYYY')
    }


    if (formInstance.value.dueDateFromTime) {
      _dueDatetimeFrom = moment(formInstance.value.dueDateFromTime, ["h:mm a"]).format("HH:mm");
    }
    if (formInstance.value.dueDateToTime) {
      _dueDatetimeTo = moment(formInstance.value.dueDateToTime, ["h:mm a"]).format("HH:mm");
    }

    if (formInstance.value.invoiceDateFromTime) {
      _invoiceDatetimeFrom = moment(formInstance.value.invoiceDateFromTime, ["h:mm a"]).format("HH:mm");
    }
    if (formInstance.value.invoiceDateToTime) {
      _invoiceDatetimeTo = moment(formInstance.value.invoiceDateToTime, ["h:mm a"]).format("HH:mm");
    }
    if(formInstance.value.datetime === true){
      let split = this.lastModifierDateTime;
      // console.log(split);
      // this.lastImportedDate = moment(split[0]).format('YYYY/MM/DD');
      let res1 = split.replace(".000", "");
    
      last_imported_time = res1;
    }

    // this.getLastModifierDateTime();

    let url = "quickbooks/import_quickbook_invoices?";
    let modelforFilter = {
      balance_amt_from: formInstance.value.balanceAmountFrom,
      balance_amt_to: formInstance.value.balanceAmountTo,
      due_date_from: _dueDateFrom,
      due_date_to: _dueDateTo,
      total_amt_from: formInstance.value.totalAmountFrom,
      total_amt_to: formInstance.value.totalAmountTo,
      invoice_date_from: _invoiceDateFrom,
      invoice_date_to: _invoiceDateTo,
      invoice_numbers: invoice_number_array1,
      due_datetime_from: _dueDatetimeFrom,
      due_datetime_to: _dueDatetimeTo,
      invoice_datetime_from: _invoiceDatetimeFrom,
      invoice_datetime_to:  _invoiceDatetimeTo,
      last_imported_time: last_imported_time,
      page: 1 
    }
    let params = `borrower_id=${this.clientId}`;

   await this._service.importquickBookInvoices(url + params, modelforFilter).then(response => {
      this._message.showLoader(false);
      const res = response.json();
      this.counter = res.records
      this.showGrid = true;
      if (res.records.length > 0) {
        
        this.isInvoiceData = false;

      }
      else{
        this.rowIsnotEmpty = false;
      }


      // set import field mapping

      this.PoNumber = res.po_number.map(item => {
        return {
          label: item,
          value: item
        }
      });

      this.fileRefNumber = res.file_ref_number.map(item => {
        return {
          label: item,
          value: item
        }
      });

      this.feeName = res.fee_name.map(item => {
        return {
          label: item.label,
          value: item.id
        }
      });

      this.feeName.unshift({
        label: "Please Select",
        value: ''
      });
      this.PoNumber.unshift({
        label: "Please Select",
        value: ''
      });
      this.fileRefNumber.unshift({
        label: "Please Select",
        value: ''
      });

      this.saved_field_mapping = res.saved_field_mapping
      this.valuePoNumber = res.saved_field_mapping.po_number_saved;
      this.valuefileRefNumber = res.saved_field_mapping.file_ref_no_saved;
      this.valuefeeName = res.saved_field_mapping.fee_name_saved;
      this.savedFieldMapingFn();

      let colkeys = res.header
      this.cyncColumnDefs = colkeys.map(elm => {
        return { 'field': elm.field, 'headerName': elm.headerName }
      });

      this.cyncColumnDefs.forEach(element => {
        if (element.field === "invoice_total_amount" || element.field === "invoice_balance") {
          element.colType = 'currency';
        }
        if (element.field === "invoice_id" || element.field === "customer_id" || element.field === "invoice_number" || element.field === "reference_number") {
          element.colType = 'string';
          element.width = 100;
        }
  
        if (element.field === "invoice_date" || element.field === "due_date") {
          element.colType = 'date';
        }
      });

      this.cyncRowData = res.records;

      this.getLastModifierDateTime();

      // this.gridApi.sizeColumnsToFit();
    
      
    })

    this.paginationCall(modelforFilter, url, params)

  }

  paginationCall(modelforFilter, url, params){
    if(this.counter.length>0){
      modelforFilter['page'] = modelforFilter['page'] + 1; 
      this._service.importquickBookInvoices(url + params, modelforFilter).then(response => {
        const res = response.json();
        this.counter = res.records;
        this.cyncRowData = this.cyncRowData.concat(res.records)
        this.paginationCall(modelforFilter, url, params)
      })
   
    }
  }
 


  savedFieldMapingFn(){
    setTimeout(() => {
      this.myform1.control.patchValue({ 
        feeNameSelectedOption: this.valuefeeName,
        poNumberSelectedOption: this.valuePoNumber,
        fileNumberSelectedOption : this.valuefileRefNumber
      });
        }, 2000);
  }

  importToCync() {
    this._message.showLoader(true);
    let url = `qb_uploads/create_qb_uploaded_file?borrower_id=${this.clientId}`
    this._service.qbImporttoCync(url, '').subscribe(response => {      
      this._message.showLoader(false);
      this._helper.showApiMessages("Imported successfully", 'success')
    });
  }

  closePopup() {
    this.display = false;
  }


  getLastModifierDateTime() {
    let url = "qb_uploads/last_imported_date_time?";
    let params = `borrower_id=${this.clientId}`;
    // console.log(url+params);
    
    this._service.getLastModifierDateTime(url + params).subscribe( res => {
      
      this.lastModifierDateTime = res;
      let split = this.lastModifierDateTime.split('T');
      // console.log(split);
      this.lastImportedDate = moment(split[0]).format('YYYY/MM/DD');
      this.lastImportedTime = moment(split[1], "HH:mm:ss").format("HH:mm");
      this.lastImportDateShowHide = true;
    }, err=> {
      this.lastImportDateShowHide = false
    })
  }

  resetFilterFields(){
    this.myform.reset();
  }

  ngOnDestroy() {
    $(".module-sub-menu").show();
  }

}
