import { Component, OnInit, Inject, OnDestroy, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { BrokerService } from '../../../service/broker.service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { GridOptions } from 'ag-grid-community';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { BrokerCommission, BrokerCommissionDetails } from '../../../broker-commission-model/broker-commission';
import * as $ from 'jquery';
import * as moment from 'moment-timezone';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';


export interface DialogData {
  id: number;
  name: string;
}

@Component({
  selector: 'app-broker-commission-detail',
  templateUrl: './broker-commission-detail.component.html',
  styleUrls: ['./broker-commission-detail.component.scss']
})
export class BrokerCommissionDetailComponent implements OnInit, AfterViewInit, OnDestroy {
  columnDefs: any
  rowData: any;
  gridOptions: GridOptions;
  excelStyles: any;
  gridApi: any;
  gridColumnApi: any;
  exceldecimalPrecision = '00';
  onApplyButtonClick = false;
  saveApiResponse: any;
  defaultColDef: any;
  frameworkComponents: any;
  constructor(private _apiMapper: APIMapper,
    private _brokerService: BrokerService,
    private _helper: Helper,
    private route: Router,
    private renderer: Renderer2,
    private el: ElementRef,
    private _message: MessageServices,
    public dialogRef: MatDialogRef<BrokerCommissionDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.columnDefs = [
      {
        headerName: 'Client Name',
        field: 'client_name',
        filter: 'agTextColumnFilter',
        sortable: true,
        headerCheckboxSelection: true,
        checkboxSelection: params => { if (params.data.release_commission === true) { params.node.setSelected(true); return true; } else { params.node.setSelected(false); return true; } },
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      },
      {
        headerName: 'Debtor Name',
        field: 'account_name',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      },
      {
        headerName: 'Invoice No.',
        field: 'receivable_no',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      },
      {
        headerName: 'Fund Date',
        field: 'funded_date',
        filter: 'agDateColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
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
      },
      {
        headerName: 'Payment Date',
        field: 'broker_fee_paid_dt',
        filter: 'agDateColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
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
      },
      {
        headerName: 'Fee Days',
        field: 'fee_days',
        filter: 'agNumberColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass"
      },
      {
        headerName: 'Invoice Amount',
        field: 'original_amount',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
        valueFormatter: this._helper.CurrencyCellRendererRoundOff
      },
      {
        headerName: 'Advance Amount',
        field: 'advance_amount',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
        valueFormatter: this._helper.CurrencyCellRendererRoundOff

      },
      {
        headerName: 'Payment Amount',
        field: 'paid_amount',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
        valueFormatter: this._helper.CurrencyCellRendererRoundOff
      },
      {
        headerName: 'Factoring Fee',
        field: 'fee_amount_on_accured',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
        valueFormatter: this._helper.CurrencyCellRendererRoundOff
      },
      {
        headerName: 'Txn Type',
        field: 'txn_type',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        cellClass: "exportColumnClass",
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      },
      {
        headerName: 'Commission%',
        field: 'broker_commission_pct',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
        valueFormatter: this._helper.CurrencyCellRendererRoundOff
      },
      {
        headerName: 'Broker Fee',
        field: 'broker_fee_amount',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
        valueFormatter: this._helper.CurrencyCellRendererRoundOff
      }
    ]
    this.rowData = [];
    this.gridOptions = {
      rowData: this.rowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true,
      suppressRowClickSelection: true,
    };
    this.frameworkComponents = { agDateInput: CustomDatePickerComponent };
    this.defaultColDef = {
      resizable: true,
      filter: true,
      agSetColumnFilter: true
    }
  }

  ngOnInit() {
    this._message.showLoader(true);
    this.getBrokerCommissionInvoiceDetails();
    this.excelStyles = BrokerCommission.setGridExportStyle();
  }
  ngAfterViewInit() {
    const w = $(self).width();
    const selectElement = <HTMLDivElement>document.querySelector(".cdk-global-overlay-wrapper .cdk-overlay-pane");
    this.renderer.removeAttribute(selectElement, 'style');
    this.renderer.setStyle(selectElement, 'width', `${w - 20}px`);
  }

  ngOnDestroy() {
    this.route.navigate(['./factoring/brokers/broker-commission']);
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // this.gridApi.sizeColumnsToFit();
    this.gridApi.showLoadingOverlay();
  }
  onModelUpdated($event) {
		if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length == 0) {
			this.gridApi.showNoRowsOverlay();
		}
		if (this.gridApi && this.gridApi.rowModel.rowsToDisplay.length > 0) {
			this.gridApi.hideOverlay();
		}
	}

	/**
   * 
   * Intialize broker commission invoice details
   */
  getBrokerCommissionInvoiceDetails() {
    const url = this._apiMapper.endpoints[CyncConstants.BROKER_COMMISSION_INVOICE_DETAILS].replace('{id}', this.data.brokerId);
    this._brokerService.getBrokerCommissionInvoiceDetailsService(url).subscribe(response => {
      this.rowData = <BrokerCommissionDetails>JSON.parse(response._body);
      this._message.showLoader(false);
    },
      error => {
        this._message.showLoader(false);
      });

  }
	/**
   * 
   * close popup
   */
  onCloseClick(): void {
    if (this.onApplyButtonClick === true) {
      let totalBrokerFeeAmountPaid = this.saveApiResponse.broker_fee_amount;
      let obj = {
        'brokerId': this.data.brokerId,
        'sub_total_broker_fee': totalBrokerFeeAmountPaid
      };
      this._brokerService.setTotalInvoiceAmountPaid(obj);
      this.dialogRef.close();
    } else {
      const popupParams = { 'title': 'Confirmation', message: CyncConstants.CLOSE_BUTTON_WARNING_MESSAGE }
      this._helper.openConfirmPopup(popupParams).subscribe(result => {
        if (result === true) {
          this.dialogRef.close();
        }
      });
    }
  }
  /**
   * 
   * Apply payable_invoice to broker commission
   */
  onApplyClick() {
    this.onApplyButtonClick = true;
    const url = this._apiMapper.endpoints[CyncConstants.PAYABLE_INVOICES_ADD_TO_BROKER_COMMISSION];
    let checkedInvoiceIds = [];
    for (let i = 0; i < this.gridOptions.api.getSelectedNodes().length; i++) {
      checkedInvoiceIds.push(this.gridOptions.api.getSelectedNodes()[i].data.id)
    }
    if (checkedInvoiceIds.length > 0) {
      let model = { "broker_id": this.data.brokerId, "checked_invoice_ids": checkedInvoiceIds }
      this._brokerService.addToBrokerCommission(url, model).subscribe(response => {
        this.saveApiResponse = <any>JSON.parse(response._body);
        const message = 'saved successfully'
        this._helper.showApiMessages(message, 'success');
        this.onCloseClick();
      });
    } else {
      this.onApplyButtonClick = false;
      this._helper.openAlertPoup('Warning', CyncConstants.INVOICE_NOT_SELECTED_WARNING_MESSAGE).subscribe(result => {
      });
    }
  }


  /**
   *  Export excel
   */
  exportData() {
    let gridHeaderKeys = [];
    this.gridColumnApi.getAllDisplayedColumns().forEach((e, i) => {
      if (e.colId != undefined) {
        gridHeaderKeys.push(e.colId);
      }
    });

    let params = {
      columnKeys: gridHeaderKeys,
      fileName: 'Broker-Commission',
      rowHeight: 15,
      headerRowHeight: 20,
      sheetName: 'Broker-Commission',
      customHeader: [
        [{
          styleId: "excelHeader",
          data: {
            type: "String",
            value: "Broker Commission Invoice Report"
          },
          mergeAcross: gridHeaderKeys.length - 1
        }]
      ]
    };

    if (gridHeaderKeys.length > 0) {
      this.gridApi.exportDataAsExcel(params);
    } else {
      this._helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
    }
  }
  /** ag-grid will by default lowercase the input string, 
   * This method restrict the uppercase letter to be automatically converted into 
   *  lowercase in ag-grid filter 
   */
  getFilterTextValue(filter, value, filterText) {
    const filterTextLoweCase = filterText.toLowerCase();
    const valueLowerCase = value.toString().toLowerCase();
    let index;
    switch (filter) {
      case 'contains':
        return valueLowerCase.indexOf(filterTextLoweCase) >= 0;
      case 'notContains':
        return valueLowerCase.indexOf(filterTextLoweCase) === -1;
      case 'equals':
        return valueLowerCase === filterTextLoweCase;
      case 'notEqual':
        return valueLowerCase !== filterTextLoweCase;
      case 'startsWith':
        return valueLowerCase.indexOf(filterTextLoweCase) === 0;
      case 'endsWith':
        index = valueLowerCase.lastIndexOf(filterTextLoweCase);
        return index >= 0 && index === (valueLowerCase.length - filterTextLoweCase.length);
      default:
        // should never happen
        console.warn(`invalid filter type ${filter}`);
        return false;
    }
  }
    /**
   * # Number Sorting Methods customSort
   * @param valueA 
   * @param valueB 
   */
  customSort(valueA, valueB) {
    var firstNumber = Number(valueA);
    var secondNumber = Number(valueB);
    if (firstNumber === null && secondNumber === null) {
      return 0;
    }
    if (firstNumber === null) {
      return -1;
    }
    if (secondNumber === null) {
      return 1;
    }
    return firstNumber - secondNumber;

  }
}
