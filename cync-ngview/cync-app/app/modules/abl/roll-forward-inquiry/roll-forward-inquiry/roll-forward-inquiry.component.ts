import { Component, OnInit } from '@angular/core';
import { FromToDateSearchModel } from '@cyncCommon/component/from-to-date-search/from-to-date-search.model';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { RollForwardEnquiryService } from '../roll-forward-enquiry.service';
import { GridOptions, GridApi } from 'ag-grid-community';
import { Helper } from '@cyncCommon/utils/helper';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import { BrokerCommission } from '@app/modules/factoring/brokers/broker-commission-model/broker-commission';
import { MessageServices } from '@cyncCommon/component/message/message.component';

@Component({
  selector: 'app-roll-forward-inquiry',
  templateUrl: './roll-forward-inquiry.component.html',
  styleUrls: ['./roll-forward-inquiry.component.scss']
})
export class RollForwardInquiryComponent implements OnInit {
  from_date: String;
  to_date: String;
  max_date: Date;
  rollForwardInquiryRowData: any;
  rollForwardInquirycolumnDefs: any;
  defaultColDef: any;
  rollForwardInquiryGridOptions: GridOptions;
  rollForwardLogsForm: FormGroup;
  currentDate: Date;
  gridApi: any;
  statusBar: any;
  gridColumnApi: any;
  frameworkComponents: any;
  excelStyles: any;
  public noRowsTemplate;
  public loadingTemplate;


  constructor(private fb: FormBuilder,
    private apiMapper: APIMapper,
    private rollForwardEnquiryService: RollForwardEnquiryService,
    private helper: Helper,
    private message: MessageServices) {
    this.max_date = new Date(this.helper.convertDateToString(new Date()));
    this.loadingTemplate =
      `<span class="ag-overlay-loading-center">data is loading...</span>`;
    this.noRowsTemplate =
      `<span>Sorry. No entries found matching the input date range. Please re-select
    </span>`;

    this.statusBar = {
      statusPanels: [
        {
          statusPanel: 'agTotalRowCountComponent',
          align: 'right',
        },
      ],
    };

    this.rollForwardInquiryRowData = [];
    this.rollForwardInquirycolumnDefs = [
      {
        headerName: 'Activity Date',
        field: 'activity_date',
        filter: 'agDateColumnFilter',
        sortable: true,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        cellStyle: { 'text-align': 'left' },
        width: 165,
        cellClass: "exportDateFormat",
        valueFormatter: this.dateFormatter,
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
        headerName: 'Source BBC Date',
        field: 'source_bbc_date',
        filter: 'agDateColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        width: 175,
        cellClass: "exportDateFormat",
        valueFormatter: this.dateFormatter,
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
        headerName: 'Client ID',
        field: 'client_id',
        filter: 'agTextColumnFilter',
        sortable: true,
        width: 180,
        cellClass: "clientId",
        cellStyle: { 'text-align': 'left' },

      },
      {
        headerName: 'Client Name',
        field: 'client_name',
        filter: 'agTextColumnFilter',
        sortable: true,
        width: 170,
        cellClass: "exportColumnClass",
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        }
      },
      {
        headerName: 'Division',
        field: 'division',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        },
        cellClass: "exportColumnClass"
      },
      {
        headerName: 'Collateral',
        field: 'collateral',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'left' },
        filterParams: {
          textFormatter: (val) => val,
          textCustomComparator: this.getFilterTextValue
        },
        cellClass: "exportColumnClass"
      },
      {
        headerName: 'New Sales',
        field: 'new_sale',
        headerTooltip: 'New Sales',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRenderer,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'New Credits',
        field: 'new_credit',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRenderer,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'New Cash Collected',
        field: 'new_cash_collected',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRenderer,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'New Adjustments',
        field: 'new_adjustment',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRenderer,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'BBC Adjustment',
        field: 'bbc_adjustment',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRenderer,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'Balance-Collateral',
        field: 'balance_collateral',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRendererRollForwardLog,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'Balance-Division',
        field: 'balance_division',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRendererRollForwardLog,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      },
      {
        headerName: 'Balance-All',
        field: 'balance_all',
        filter: 'agTextColumnFilter',
        sortable: true,
        cellStyle: { 'text-align': 'right' },
        valueFormatter: this.helper.CurrencyCellRendererRollForwardLog,
        cellClass: "exportValueTwoDecimalPlaces",
        comparator: this.customSort,
      }
    ]


    this.rollForwardInquiryGridOptions = {
      rowData: this.rollForwardInquiryRowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true,
      suppressRowClickSelection: true
    };
    this.frameworkComponents = { agDateInput: CustomDatePickerComponent };
    this.defaultColDef = {
      resizable: true,
      filter: true

    }
  }

  ngOnInit() {
    this.currentDate = new Date();
    this.currentDate.setMonth(this.currentDate.getMonth() - 6);
    let timeZone = CyncConstants.getLenderTimezone();
    this.to_date = moment(new Date()).tz(timeZone).format("MM/DD/YYYY");
    this.from_date = moment(this.currentDate).tz(timeZone).format("MM/DD/YYYY");
    this.createRollForwardLogsForm();
    this.message.showLoader(true);
    this.getRollForwardInquiryData(this.from_date, this.to_date);
    this.excelStyles = BrokerCommission.setGridExportStyle();
  }
  createRollForwardLogsForm() {
    let timeZone = CyncConstants.getLenderTimezone();
    this.rollForwardLogsForm = this.fb.group({
      'from_activity_date': [moment(this.currentDate).tz(timeZone).format("MM/DD/YYYY")],
      'to_activity_date': [moment(new Date()).tz(timeZone).format("MM/DD/YYYY")],
    });

  }

  getRollForwardInquiryData(fromDateValue, toDateValue) {
    const url = (this.apiMapper.endpoints[CyncConstants.ROLLFORWARD_INQUIRY]).replace('{from_date}', fromDateValue).replace('{to_date}', toDateValue);;
    this.rollForwardEnquiryService.getRollForwardEnquiryService(url).subscribe(response => {
      this.rollForwardInquiryRowData = <any>JSON.parse(response._body).rollfoward_inquirys;
      this.message.showLoader(false);
    });

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

	/**
	 * On Grid Ready Method
	 * @param params
	 */
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    // params.api.sizeColumnsToFit();
  }
	/**
	/**
	* Date range search button click event
	* @param type 
	*/
  onSearchButtonClickEvent() {
    let fromDateValue = '';
    let toDateValue = '';
    fromDateValue = moment(this.rollForwardLogsForm.get('from_activity_date').value).format("MM/DD/YYYY");
    toDateValue = moment(this.rollForwardLogsForm.get('to_activity_date').value).format("MM/DD/YYYY")
    let fromDateYear = new Date(fromDateValue).getFullYear();
    let toDateYear = new Date(toDateValue).getFullYear();
    if (fromDateValue > toDateValue && (fromDateYear >= toDateYear)) {
      this.helper.showApiMessages(CyncConstants.SELECT_ACTIVITY_DATE_VALIDATION_ERROR_MESSAGE, 'danger');
    } else {
      this.message.showLoader(true);
      this.getRollForwardInquiryData(fromDateValue, toDateValue);
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
  /*
  *format activity date
  */
  dateFormatter(params: any) {
    return moment(params.value).format('MM/DD/YYYY');
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
      columnWidth: (p) => {
        if (p.index < 2) {
          return 100;
        }
        return 130;
      },
      columnKeys: gridHeaderKeys,
      fileName: 'RollForward-Inquiry',
      rowHeight: 15,
      headerRowHeight: 20,
      sheetName: 'RollForward-Inquiry',
      customHeader: [
        [{
          styleId: "excelHeader",
          data: {
            type: "String",
            value: "RollForward-Inquiry Export"
          },
          mergeAcross: gridHeaderKeys.length - 1
        }]
      ]
    };

    if (gridHeaderKeys.length > 0) {
      this.gridApi.exportDataAsExcel(params);
    } else {
      this.helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
    }
  }
}
