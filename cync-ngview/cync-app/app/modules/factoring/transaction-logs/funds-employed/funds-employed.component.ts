import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FundsEmployedService } from '../service/funds-employed.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { GridOptions } from 'ag-grid-community';
import * as moment from 'moment-timezone';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import { FundsEmployedExportStyle } from '../model/funds-employed.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';


@Component({
  selector: 'app-funds-employed',
  templateUrl: './funds-employed.component.html',
  styleUrls: ['./funds-employed.component.scss'],
  providers: [FundsEmployedService]
})
export class FundsEmployedComponent implements OnInit {

  borrowerId: number;
  fundsEmployedRowData: any;
  fundsEmployedColoumnDefs: any;
  fundsEmployedGridApi: any;
  fundsEmployedGridParams: any;
  fundsEmployedGridOptions: GridOptions;
  fundsEmployedGridColumnApi: any;
  fundsEmployedDefaultColDef: any;
  public excelStyles: any;
  isDataLoaded: boolean;
  frameworkComponents: any;
  private rowSelection: string;
  paginationPageSize : number;


  constructor(
    private http: HttpClient,
    private fundsService: FundsEmployedService,
    private _apiMapper: APIMapper,
    private _message: MessageServices,
    
    private helper: Helper) {


    {
      this.isDataLoaded = false;
      this.fundsEmployedGridOptions = {
        columnDefs: this.fundsEmployedColoumnDefs,
        enableBrowserTooltips: true,
        // localeText: {
        // 	noRowsToShow: 'No Records Found'
        // }
      }

      /**
          * Initialized grid column defination
          */
      this.fundsEmployedColoumnDefs = [

        {
          headerName: "Activity Date",
          field: "activity_date",
          filter: 'agDateColumnFilter',
          //tooltipField: 'activity_date',
          headerTooltip: 'Activity Date',
          cellClass: "exportColumnClassLeft",
          resizable: true,
          headerCheckboxSelection: true,
				//valueFormatter: this.getDateFormater,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          cellStyle: { 'text-align': 'left' },
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
          },
        },
        {
          headerName: "Transaction ID",
          field: "transaction_no",
          filter: 'agTextColumnFilter',
          tooltipField: 'transaction_no',
          headerTooltip: 'Transaction ID',
          cellStyle: { 'text-align': 'left' },
          resizable: true,

          filterParams: {
            textFormatter: (val) => val,
            textCustomComparator: this.getFilterTextValue
          },
          cellClass: "exportColumnClassLeft"
        },
        {
          headerName: "Type",
          field: "tag_type",
          filter: 'agTextColumnFilter',
          tooltipField: 'tag_type',
          headerTooltip: 'Type',
          cellStyle: { 'text-align': 'left' },
          resizable: true,
          filterParams: {
            textFormatter: (val) => val,
            textCustomComparator: this.getFilterTextValue
          },
          cellClass: "exportColumnClassLeft",
        },
        {
          headerName: "Charge Template",
          field: "charge_name",
          filter: 'agNumberColumnFilter',
          tooltipField: 'charge_name',
          headerTooltip: 'Charge Template',
          cellStyle: { 'text-align': 'left' },
          resizable: true,
          filterParams: {
            textFormatter: (val) => val,
            textCustomComparator: this.getFilterTextValue
          },
          cellClass: "exportColumnClassLeft"
        },
        {
          headerName: "(+)/(-)",
          field: "sign",
          filter: 'agNumberColumnFilter',
         // tooltipField: 'sign',
          headerTooltip: 'sign',
          cellStyle: { 'text-align': 'left' },
          resizable: true,
          filterParams: {
            textFormatter: (val) => val,
            textCustomComparator: this.getFilterTextValue
          },
          cellClass: "exportColumnClassLeft"
        },
        {
          headerName: "Charge Amount",
          field: "charge_amount",
          filter: 'agNumberColumnFilter',
          //tooltipField: 'charge_amount',
          headerTooltip: 'Charge Amount',
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellStyle: { 'text-align': 'right' },
          resizable: true,
          comparator: this.customSort,
          cellClass: "exportValueTwoDecimalPlaces"

        },
        {
          headerName: "Adjusted Amount",
          field: "adjusted_amount",
          filter: 'agNumberColumnFilter',
         // tooltipField: 'adjusted_amount',
        headerTooltip: 'Adjusted Amount',
         valueFormatter: this.helper.CurrencyCellRenderer,
          cellStyle: { 'text-align': 'right' },
          resizable: true,
          comparator: this.customSort,
          cellClass: "exportValueTwoDecimalPlaces",
        },
        {
          headerName: "NFE Amount",
          field: "net_fund_emp_amount",
          filter: 'agNumberColumnFilter',
          //tooltipField: 'net_fund_emp_amount',
          headerTooltip: 'NFE Amount',
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellStyle: { 'text-align': 'right' },
          resizable: true,
          comparator: this.customSort,
          cellClass: "exportValueTwoDecimalPlaces",
          
        },
      ];

      this.fundsEmployedDefaultColDef = {
        sortable: true,
        filter: true,
        resizable: true,
        
        };


        this.paginationPageSize = 10;
      this.fundsEmployedGridOptions = {
      rowData: this.fundsEmployedRowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true,
      suppressRowClickSelection: true
    };
      this.frameworkComponents = { agDateInput: CustomDatePickerComponent };
      this.fundsEmployedRowData = [];
      this.excelStyles = FundsEmployedExportStyle.setGridExportStyle();

    }
    // function isFirstColumn(params) {
    //   var displayedColumns = params.columnApi.getAllDisplayedColumns();
    //   var thisIsFirstColumn = displayedColumns[0] === params.column;
    //   return thisIsFirstColumn;
    // }

    this.helper.getClientID().subscribe(data => {
      this.borrowerId = Number(data);
      this.getFundsEmployedDetails();
    })


  }





  ngOnInit() {
    this.getFundsEmployedDetails();
  }


  getFundsEmployedDetails() {
    this._message.showLoader(true);
  //  const url = this._apiMapper.endpoints[CyncConstants.GET_FUNDED_EMPLOYED].replace('{clientId}', this.borrowerId).replace('{page_no}',1).replace('{rows_no}',8);
  const url = this._apiMapper.endpoints[CyncConstants.GET_FUNDED_EMPLOYED].replace('{clientId}', this.borrowerId);
  this.fundsService.getFundsEmployedService(url).subscribe(response => {
      let tempData = JSON.parse(response._body)
      this.isDataLoaded = true;
      this.fundsEmployedRowData = tempData;
      console.table(this.fundsEmployedRowData);
     // debugger
      this._message.showLoader(false);
    }, error => {
      this.isDataLoaded = false;
      this._message.showLoader(false);
    });
  }

  fundsEmployedOnGridReady(params: any) {
    this.fundsEmployedGridParams = params;
    this.fundsEmployedGridApi = params.api;
    this.fundsEmployedGridColumnApi = params.columnApi;
    this.fundsEmployedGridApi.showLoadingOverlay();
  }

  onModelUpdated($event) {
    if (this.fundsEmployedGridApi && this.fundsEmployedGridApi.rowModel.rowsToDisplay.length == 0) {
      this.fundsEmployedGridApi.showNoRowsOverlay();
    }
    if (this.fundsEmployedGridApi && this.fundsEmployedGridApi.rowModel.rowsToDisplay.length > 0) {
      this.fundsEmployedGridApi.hideOverlay();
    }
  }

	/**
    * Export button enable or disable according to grid data conditions
    */
  isExportButtonDisable() {
    if (this.fundsEmployedRowData && this.fundsEmployedRowData.length > 0) {
      return true;
    } else {
      return false;
    }
  }

	/**
    *Refresh button enable or disable according to grid data conditions
    */
  isRefreshButtonDisable() {
    if (this.fundsEmployedRowData && this.fundsEmployedRowData.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
**
  * This method export the file into excel format
  */
  exportData() {
    // Get array of ag-grid display header fields
    let gridHeaderKeys = [];
    (this.fundsEmployedGridColumnApi.getAllDisplayedColumns()).forEach((e, i) => {
      if (e.colId != undefined) {
        gridHeaderKeys.push(e.colId);
      }
    });
    let params = {
      columnKeys: gridHeaderKeys,
      fileName: 'funds-employed',
      rowHeight: 15,
      headerRowHeight: 20,
      sheetName: 'Sheet1',
      customHeader: [
        [{
          styleId: "excelHeader",
          data: {
            type: "String",
            value: "Funds Employed Report"
          },
          mergeAcross: gridHeaderKeys.length - 1
        }]
      ]
    };
    if (gridHeaderKeys.length > 0) {
      this.fundsEmployedGridApi.exportDataAsExcel(params);
    }
    else {
      this.helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
    }
  }
//date formator function//

getDateFormater(inputDate: any ) : string { 
  console.log("date",inputDate.value) ; 
   return moment(inputDate.value, "YYYY-MM-DD").format(CyncConstants.DATE_FORMAT);
  }


  /**
*  ag-grid will by default lowercase the input string, 
** This method restrict the uppercase letter to be automatically converted into 
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
	 * This method reset fundsEmployed commission data
	 * 
	 */
  redrawAllRows() {
    this.getFundsEmployedDetails();
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
