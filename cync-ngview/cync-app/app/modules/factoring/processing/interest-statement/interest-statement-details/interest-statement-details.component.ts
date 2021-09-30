import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Helper } from '@cyncCommon/utils/helper';
import { ProcessingService } from '../../services/processing-service';
import { GridOptions } from 'ag-grid-community';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import * as moment from 'moment';
@Component({
  selector: 'app-interest-statement-details',
  templateUrl: './interest-statement-details.component.html',
  styleUrls: ['./interest-statement-details.component.scss']
})
export class InterestStatementDetailsComponent implements OnInit {

  rowData: any;
  defaultColDef: any;
  columnDefs: any;

  gridApi: any;
  gridColumnApi: any;
  overlayLoadingTemplate: string;

  transationDate: any;
  clientId: number;
  transactionType: string;
  //Total: any;
  isFooterTotalGrup: boolean;

  constructor(
    private message: MessageServices,
    public dialogRef: MatDialogRef<InterestStatementDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private helper: Helper,
    private processingservice: ProcessingService) {
    this.transactionType = this.data.transaction_type;

    this.overlayLoadingTemplate = '<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>';

    this.columnDefs =[];
    this.isFooterTotalGrup=true;
    this.defaultColDef={
      resizable: true,
      sortable:true,
      minWidth: 150,
      width: 150,
      maxWidth: 250
    };

    this.transactionType = this.data.transaction_type;
    this.transationDate = this.data.transation_date;
    this.transationDate = moment(this.transationDate).format('MM/DD/YYYY');
    this.clientId = this.data.client_id;

  }

  ngOnInit() {
    this.getStatmentDetails();
  }

  getStatmentDetails() {
    this.message.showLoader(true);
    let url = `factoring/interest/transactionDetails?client_id=${this.clientId}&transaction_type=${this.transactionType}&date=${this.transationDate}`;
    this.processingservice.getService(url).subscribe(response => {
      this.rowData = response.data;
      if(this.rowData.length==1){
        this.isFooterTotalGrup=false;
      }
      let subTotal = this.addTotalRow(this.rowData);
      this.createColDef(response.header_column, subTotal);
      this.message.showLoader(false);
    });
  }

  // Create the hash object Methods.
  createColDef(colList: any, subTotal: any) {
    const tempColumnDef: any = [];
    if (colList) {
      for (const col of colList) {
        if(col.key==='funding_date'){
            tempColumnDef.push({ 
              headerName: col.display_value, 
              field: col.key,
              valueFormatter: this.dateFormatter
            });
        } else if(col.key==='invoice_date'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:250,
            valueFormatter: this.dateFormatter,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                 footerValueGetter: function(params) { return ``; 
                }
              }

          });
        }else if(col.key==='transaction_date'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            hide:true,
            valueFormatter: this.dateFormatter
          });
        }else if(col.key==='batch_no'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            hide:true
          });
        }else if(col.key==='activity_date'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            hide: true, 
            valueFormatter: this.dateFormatter
          });
       }else if (col.key==='charge_amount'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:250,
            cellStyle: { textAlign: 'right' },
            valueFormatter: this.helper.currencyFormateSixDecimal,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                 footerValueGetter: function(params) { return `<b>Total &nbsp;&nbsp;: &nbsp; ${subTotal.charge_amount} </b>`; 
                }
              }
          });
        }else if (col.key==='invoice_charge_amount'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:200,
            cellStyle: { textAlign: 'right' },
            valueFormatter: this.helper.currencyFormateSixDecimal,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                 footerValueGetter: function(params) { return `<b>Total &nbsp;&nbsp;: &nbsp; ${subTotal.invoice_charge_amount} </b>`; 
                }
              }
          });
        }else if(col.key==='adjustment_amount'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:240,
            cellStyle: { textAlign: 'right' },
            valueFormatter: this.helper.currencyFormateSixDecimal,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                 footerValueGetter: function(params) { return `<b>Total &nbsp;&nbsp;: &nbsp; ${subTotal.adjustment_amount} </b>`; 
                }
              }
          });
        } else if( col.key==='funded_invoice_amount'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:230,
            cellStyle: { textAlign: 'right' },
            valueFormatter: this.helper.currencyFormateSixDecimal,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                 footerValueGetter: function(params) { return `<b>Total &nbsp;&nbsp;: &nbsp; ${subTotal.funded_invoice_amount} </b>`; 
                }
              }
          });

        }else if( col.key==='notes'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:250,
            cellStyle: { textAlign: 'left' },
          });
        }
        else if(col.key==='funded_advance_amount'){
          tempColumnDef.push({ 
            headerName: col.display_value, 
            field: col.key,
            width:250,
            cellStyle: { textAlign: 'right' },
            valueFormatter: this.helper.currencyFormateSixDecimal,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                 footerValueGetter: function(params) { return `<b> ${subTotal.funded_advance_amount} </b>`; 
                }
              }
          });
        } else{
          tempColumnDef.push({ headerName: col.display_value, field: col.key});
        }
      }
      this.columnDefs = tempColumnDef;
    }
    
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  
  }

// Add TototalRow columns
  addTotalRow(rowData: any): any {
    let result: any;
    let fieldsObj: any;
    const usdFormate = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2
     });
     
    switch(this.transactionType){
      case 'Interest Charge':
        fieldsObj={charge_amount: 0, invoice_charge_amount:0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key]+= Number(row[key])
          }
        });
        fieldsObj.charge_amount= usdFormate.format(Number(fieldsObj.charge_amount));
        fieldsObj.invoice_charge_amount= usdFormate.format(Number(fieldsObj.invoice_charge_amount));
        //if Nagetive checked
        fieldsObj.charge_amount=this.checkNegativeFormate( fieldsObj.charge_amount);
        fieldsObj.invoice_charge_amount=this.checkNegativeFormate( fieldsObj.invoice_charge_amount);
       
        result=fieldsObj;
       break;
      case 'Interest Charge Adj':
        fieldsObj={adjustment_amount: 0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.adjustment_amount= usdFormate.format(Number(fieldsObj.adjustment_amount));
        fieldsObj.adjustment_amount= this.checkNegativeFormate(fieldsObj.adjustment_amount);
        result=fieldsObj;
      break;
      case 'Funding':
        fieldsObj={funded_invoice_amount: 0, funded_advance_amount:0 };
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.funded_advance_amount= usdFormate.format(Number(fieldsObj.funded_advance_amount));
        fieldsObj.funded_invoice_amount=usdFormate.format(Number(fieldsObj.funded_invoice_amount));

        fieldsObj.funded_advance_amount= this.checkNegativeFormate(fieldsObj.funded_advance_amount);
        fieldsObj.funded_invoice_amount= this.checkNegativeFormate(fieldsObj.funded_invoice_amount);
        result=fieldsObj;
       break;
      case 'Funding Adj':
        fieldsObj={adjustment_amount: 0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.adjustment_amount= usdFormate.format(Number(fieldsObj.adjustment_amount));
        fieldsObj.adjustment_amount= this.checkNegativeFormate(fieldsObj.adjustment_amount);
        result=fieldsObj;
      break;
      case 'Payment Adj':
        fieldsObj={adjustment_amount: 0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.adjustment_amount= usdFormate.format(Number(fieldsObj.adjustment_amount));
        fieldsObj.adjustment_amount= this.checkNegativeFormate(fieldsObj.adjustment_amount);
        result=fieldsObj;
      break;
      case 'Reserve Posting Adj':
        fieldsObj={adjustment_amount: 0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.adjustment_amount= usdFormate.format(Number(fieldsObj.adjustment_amount));
        fieldsObj.adjustment_amount= this.checkNegativeFormate(fieldsObj.adjustment_amount);
        result=fieldsObj;
      break;
      case 'Reserve Posting':
        fieldsObj={charge_amount: 0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.charge_amount= usdFormate.format(Number(fieldsObj.charge_amount));
        fieldsObj.charge_amount= this.checkNegativeFormate(fieldsObj.charge_amount);
        result=fieldsObj;
      break;
      case 'Chargeback':
        fieldsObj={charge_amount: 0};
        rowData.forEach((row) => {
          for (let key in fieldsObj) {
            fieldsObj[key] += Number(row[key]);
          }
        });
        fieldsObj.charge_amount= usdFormate.format(Number(fieldsObj.charge_amount));
        fieldsObj.charge_amount= this.checkNegativeFormate(fieldsObj.charge_amount);
        result=fieldsObj;
        break;
      default:
      console.log('Nothing..');
    }
    return result;
  }

  cancelClick() {
    this.dialogRef.close();
  }

  dateFormatter(params: any) {
    if(params.value === null){
      return '';
    }else{
    return moment(params.value).format('MM/DD/YYYY');
    }
  }

  checkNegativeFormate(pval: any ): any {
      let result;
      if (pval.indexOf('-') !== -1) {
        result = "(" + pval.replace('-', '') + ")";
      } else {
        result= pval;
      }
      return result;
  }

}
