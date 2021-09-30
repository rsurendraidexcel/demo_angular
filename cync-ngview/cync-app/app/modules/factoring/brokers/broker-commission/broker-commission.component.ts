import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { CyncConstants } from '@cyncCommon/utils/constants';
import * as moment from 'moment-timezone';
import { BrokerLinkComponent } from './sub-component/broker-link/broker-link.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { BrokerService } from '../service/broker.service';
import { Observable } from 'rxjs';
import { Helper } from '@cyncCommon/utils/helper';
import { Router } from '@angular/router';
import { BrokerCommission } from '../broker-commission-model/broker-commission';
import { MessageServices } from '@cyncCommon/component/message/message.component';


@Component({
  selector: 'app-broker-commission',
  templateUrl: './broker-commission.component.html',
  styleUrls: ['./broker-commission.component.scss']
})
export class BrokerCommissionComponent implements OnInit {
  columnDefs: any;
  gridApi: any;
  rowData: any;
  gridOptions: GridOptions;
  releaseDate: any;
  brokerList: any;
  brokerApiResponse: any
  checkBoxApiResponse: any;
  defaultColDef: any;
  brokerFeeAmount: [];
  dataLoaded: boolean;
  excelStyles: any;
  exceldecimalPrecision = '00';
  gridColumnApi: any;
  onSaveInvoice:any;

  constructor(private _apiMapper: APIMapper,
    private _brokerService: BrokerService,
    private _helper: Helper,
    private route: Router,
    private _message: MessageServices
  ) {
    this.rowData = [];
    this.columnDefs = [
      {
        headerName: 'Broker',
        field: 'name',
        filter: 'agTextColumnFilter',
        sortable: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellStyle: { 'text-align': 'left' },
        width: 160,
        cellClass: "exportColumnClass",
        cellRendererFramework: BrokerLinkComponent,
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      },
      {
        headerName: 'Broker Commission',
        field: 'broker_fee_amount',
        filter: 'agTextColumnFilter',
        sortable: true,
        width: 160,
        cellStyle: { 'text-align': 'right' },
        cellClass: "exportValueTwoDecimalPlaces",
        valueFormatter: this._helper.CurrencyCellRendererRoundOff,
        comparator: this.customSort
      },
      {
        headerName: 'Disbursement Amount',
        field: 'disbursement_amt',
        filter: 'agTextColumnFilter',
        sortable: true,
        width: 160,
        cellClass: "exportValueTwoDecimalPlaces",
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this._helper.CurrencyCellRendererRoundOff,
        comparator: this.customSort
      },
      {
        headerName: 'Disbursement',
        field: 'broker_distribution_method',
        filter: 'agTextColumnFilter',
        sortable: true,
        width: 160,
        cellClass: "exportColumnClass",
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      }
    ]


    this.gridOptions = {
      rowData: this.rowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true,
      suppressRowClickSelection: true
    };
    this.defaultColDef = {
      resizable: true,
      filter: true

    }
  }

  ngOnInit() {
    this._message.showLoader(true);
    this.lenderTimeZoneReleaseDate();
    this.getBrokerDetails();
    this.getBrokerList();
    this.getTotalBrokerFeeAmountOfInvoices();
    this.excelStyles = BrokerCommission.setGridExportStyle();
  }

	/**
	 * On Grid Ready Method
	 * @param params
	 */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();
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
   * Get Broker commission dashboard data
   * 
   */
  getBrokerDetails() {
    const url = this._apiMapper.endpoints[CyncConstants.BROKER_COMMISSION_DETAILS];
    this._brokerService.getBrokerCommissionService(url).subscribe(response => {
      this.rowData = <any>JSON.parse(response._body);
      this.brokerApiResponse = this.rowData;
      this.onSaveInvoice = this.rowData;
      this.dataLoaded = true;
      this._message.showLoader(false);
    },
      error => {
        this._message.showLoader(false);
      }
    );
  }

	/**
	 * This method reset broker commission data
	 * 
	 */
  redrawAllRows() {
    const url = this._apiMapper.endpoints[CyncConstants.RESET_BROKER_COMMISSION_DASHBOARD];
    this._brokerService.refreshGrid(url).subscribe(data => {
      const url = this._apiMapper.endpoints[CyncConstants.BROKER_COMMISSION_DETAILS];
      this._brokerService.getBrokerCommissionService(url).subscribe(response => {
        this.rowData = <any>JSON.parse(response._body);
      });
    });
  }

  /**
    * on broker selected 
    * 
    */
  onRowSelected(event) {
    const selectedAllBrokers = this.gridOptions.api.getSelectedRows();
    let brokerIds = [];
    for (let i = 0; i < selectedAllBrokers.length; i++) {
      brokerIds.push(selectedAllBrokers[i].id);
    }
    if (brokerIds.length > 0) {
      let model = { "broker_ids": brokerIds };
      const url = this._apiMapper.endpoints[CyncConstants.CHECK_BROKERS];
      this._brokerService.releaseBrokerService(url, model).subscribe(response => {

        this.checkBoxApiResponse = <any>JSON.parse(response._body);
   
        if (event.node.selected) {
          for (let i = 0; i < this.checkBoxApiResponse.length;) {
            selectedAllBrokers.map((elm) => {
              if (this.checkBoxApiResponse[i].broker_fee_amount === '0') {
                elm.disbursement_amt = elm.broker_fee_amount;
                i++;
                this.gridOptions.api.redrawRows();
              } else {
                elm.disbursement_amt =this.checkBoxApiResponse[i].broker_fee_amount;
                i++;
                this.gridOptions.api.redrawRows();
              }
            });
          }
        } else {
          this.emptyDistribututionAmount(event.data.id);
          this.gridOptions.api.redrawRows();
        }

      });
    } else {
      this.emptyDistribututionAmount();
      this.gridOptions.api.refreshCells();
    }
  }
  /**
   * Method to empty distribution amount on unselect checkbox
   * @param id  
   */
  emptyDistribututionAmount(id?: any) {
    if (id) {
      this.rowData.map((elm) => {
        if (elm.id === id) {
          elm.disbursement_amt = '0.00';
        }
      });
    } else {
      this.rowData.map((elm) => elm.disbursement_amt = '0.00');
    }
  }

  /**
    * release date based on lender timezone
    * 
    */
  lenderTimeZoneReleaseDate() {
    let timeZone = CyncConstants.getLenderTimezone();
    this.releaseDate = moment(new Date()).tz(timeZone).format("MM/DD/YYYY");
  }

  /**
    * Get respective broker data on change broker in dropdown
    * 
    */
  onChangeBroker(event) {
    let brokerId = event.target.value;
    if (brokerId === '') {
      this.rowData = this.brokerApiResponse;
    } else {
      let tempRowData = (this.brokerApiResponse).filter(function (obj) {
        return obj.id == brokerId;
      });
      this.rowData = tempRowData;
    }
  }
  /**
    * Get brokerList dropdown
    * 
    */
  getBrokerList() {
    const url = this._apiMapper.endpoints[CyncConstants.GET_ALL_BROKERS];
    this._brokerService.getBrokerListService(url).subscribe(response => {
      this.brokerList = <any>JSON.parse(response._body);
    });
  }
  /**
     * Get Total Broker Fee Amount Of Invoices
     * 
     */
  getTotalBrokerFeeAmountOfInvoices() {
    this._brokerService.getTotalInvoiceAmountPaid().subscribe(data => {
      this.rowData.map((elm) => {
        if (elm.id === data.brokerId) {
          elm.disbursement_amt = data.sub_total_broker_fee.split(',').join('');
        }
      });
      if (this.dataLoaded === true)
        this.gridOptions.api.redrawRows();
    });
  }

  /**
     * Release broker commission
     * 
     */
  onReleaseCheck() {
    if (this.gridOptions.api.getSelectedRows().length > 0) {
      const popupParams = { 'title': 'Confirmation', message: 'Upon selecting Yes,selected broker commission will be released' }
      this._helper.openConfirmPopup(popupParams).subscribe(result => {
        if (result === true) {
          this.releaseBrokerInvoice();
        }
      });
    } else {
      this._helper.openAlertPoup('Warning', CyncConstants.RELEASE_COMMISSION_WARNING_MESSAGE).subscribe(result => {
      });
    }
  }
  /**
     * Export broker-commission data in excel 
     * 
     */
  exportData() {
    // Get array of ag-grid display header fields
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
            value: "Broker Commission Report"
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
	/**
	 * This method gets called to download excel file from blob response returned from api
	 * @param filePath
	 */
  downloadFile(filePath: any) {
    let domain = window.location.hostname;
    // let domain = "staging.cyncsoftware.com"
    let elem = window.document.createElement('a');
    elem.href = "https://" + domain + filePath;
    elem.download = "release paid invoice.zip";
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
	/**
	 * This method gets called to release if broker is selected
	 * 
	 */
  releaseBrokerInvoice() {
    const selectedAllBrokers = this.gridOptions.api.getSelectedRows();
    let brokerIds = [];
    for (let i = 0; i < selectedAllBrokers.length; i++) {
      brokerIds.push(selectedAllBrokers[i].id);
    }
    const url = this._apiMapper.endpoints[CyncConstants.RELEASE_BROKER_COMISSION];
    let model = { "broker_ids": brokerIds, "release_date": this.releaseDate };
    this._brokerService.releaseBrokerCommissionService(url, model).subscribe(response => {
      let resleaseApiResponse = <any>JSON.parse(response._body)
      const message = 'Invoice Paid Successfully';
      this._helper.showApiMessages(message, 'success');
      if (resleaseApiResponse.status === "ok" && resleaseApiResponse.transaction_id !== (undefined || null)) {
        this._helper.openBrokerReleasePopup('Warning', "Broker Paid Commission Report.zip").subscribe(result => {
          if (result) {
            const url = this._apiMapper.endpoints[CyncConstants.PRINT_RELEASED_INVOICES_REPORT];
            let model = { "transaction_id": resleaseApiResponse.transaction_id, "invoices": resleaseApiResponse.invoices };
            this._brokerService.releaseInvoiceReportService(url, model).subscribe(res => {
              let reportApiResponse = <any>JSON.parse(res._body);
              this.downloadFile(reportApiResponse.file_path);
              this.getBrokerDetails();
            });
          } else {
            this.getBrokerDetails();
          }
        });
      }
    });
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
