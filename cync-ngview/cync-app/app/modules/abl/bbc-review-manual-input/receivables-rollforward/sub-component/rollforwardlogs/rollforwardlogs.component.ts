import { Component, OnInit } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { BbcReviewService } from '../../../services/bbc-review.service';
import { GridOptions } from 'ag-grid-community';
import { RollForwardEditPopupDetailsComponent } from './roll-forward-edit-popup-details/roll-forward-edit-popup-details.component';
import { MatDialog } from '@angular/material';
import { RollfrowardAddDetailsComponent } from './rollfroward-add-details/rollfroward-add-details.component';
import * as $ from 'jquery';
import * as moment from 'moment-timezone';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { RollforwardLogExportStyle } from '../../../rollforward-logs-model/rollforward-log';

@Component({
  selector: 'app-rollforwardlogs',
  templateUrl: './rollforwardlogs.component.html',
  styleUrls: ['./rollforwardlogs.component.scss']
})
export class RollforwardlogsComponent implements OnInit {

  // Defination for Grid propertise
  rollForwordLogsRowData: any;
  rollForwardLogColdef: any;
  rollForwardLogGridOptions: GridOptions;
  rollForwardLogdefaultColDef: any;
  selectedRolls: any = [];
  frameworkComponents: any;
  height: any;
  bbcDate: any;
  systemGeneratedRows: any;
  rollforward_to_adjust_collateral: any;
  clientId: any;
  public excelStyles: any;
  gridColumnApi: any;
  private gridApi: any;


  constructor(private _apiMapper: APIMapper,
    private helper: Helper,
    private bbcReviewService: BbcReviewService,
    public dialog: MatDialog,
    private clientSelectSrv: ClientSelectionService) {

    this.clientId = CyncConstants.getSelectedClient();

    // Assignment grid properties attribute
    this.rollForwordLogsRowData = [];
    this.rollForwardLogGridOptions = {
      rowData: this.rollForwordLogsRowData,
      context: {
        componentParent: this
      },
      suppressCellSelection: true
    },
      this.frameworkComponents = { agDateInput: CustomDatePickerComponent };
    this.rollForwardLogdefaultColDef = {

      filter: true,
      agSetColumnFilter: true,
      suppressCellSelection: true,
      suppressRowClickSelection: true,
      resizable: true
    }

    this.excelStyles = RollforwardLogExportStyle.setGridExportStyle();
  }


  ngOnInit() {
    this.clientSelectSrv.clientSelected.subscribe(dt => {
      this.clientId = dt;
      this.afterBorrowChangeLoad();
    });

    this.loadDataConditional();
  }
  /* After Change BorrowLoad */
  afterBorrowChangeLoad() {
    this.loadDataConditional();
    this.ngAfterViewInit();

  }

  ngAfterViewInit() {
    this.height = $(self).width();
    setTimeout(() => {
      let p = document.querySelectorAll(".ag-cell-wrapper");
      $(p).find(".ag-selection-checkbox.ag-hidden").next().css({ 'margin-left': '30px' });
    }, 800);
  }
	/**
   * on Ready Grid Load
   * 
   */
  onGridReadyRollForward(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rollForwardLogGridOptions.api.sizeColumnsToFit();
  }

  loadDataConditional() {
    this.bbcReviewService.getAction().subscribe(res => {
      if (res === 'save' || res === 'edit') {
        this.loadDefaultRollForwardData();
        this.ngAfterViewInit();
        this.selectedRolls = [];
      } else {
        this.loadDefaultRollForwardData();
      }
    });

  }

  /**
   * Load the Default RollForwardData
   */
  loadDefaultRollForwardData() {
    const url = this._apiMapper.endpoints[CyncConstants.GET_ROLLFORWARD_LOGS].replace('{clientId}', this.clientId);
    this.bbcReviewService.getRollForwardLogService(url).subscribe(response => {
      this.rollforward_to_adjust_collateral = <any>JSON.parse(response._body).rollforward_to_adjust_collateral;
      this.rollForwardLogColdef = [
        {
          headerName: 'Date',
          width: 160,
          suppressSizeToFit:true,
          field: 'activity_date',
          filter: 'agDateColumnFilter',
          cellClass: "dateFormat",
          sortable: true,
          headerCheckboxSelection: true,
          checkboxSelection: params => { if (params.data.user.toLowerCase() === "manual") { return true; } else { return false; } },
          cellStyle: { 'text-align': 'left' },
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
          },

        },
        {
          headerName: 'Division',
          field: 'division_name',
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
          field: 'collateral_name',
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
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellClass: "exportValueTwoDecimalPlaces",
        },
        {
          headerName: 'New Credits',
          field: 'new_credit',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellClass: "exportValueTwoDecimalPlaces",
        },
        {
          headerName: 'New Cash Collected',
          field: 'cash_collected',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellClass: "exportValueTwoDecimalPlaces",
        },
        {
          headerName: 'New Adjustments',
          field: 'new_adjustment',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellClass: "exportValueTwoDecimalPlaces",
        },
        {
          headerName: 'BBC Adjustment',
          field: 'bbc_adjustment',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRenderer,
          cellClass: "exportValueTwoDecimalPlaces",
        },
        {
          headerName: 'User',
          field: 'user',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'left' },
          hide: true,
        },
        {
          headerName: 'Balance-Collateral',
          field: 'collateral_balance',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRendererRollForwardLog,
          cellClass: "exportValueTwoDecimalPlaces",
          hide: !this.rollforward_to_adjust_collateral,
          //hide: true
        },
        {
          headerName: 'Balance-Division',
          field: 'division_balance',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRendererRollForwardLog,
          cellClass: "exportValueTwoDecimalPlaces",
          hide: !this.rollforward_to_adjust_collateral
          //hide: true
        },
        {
          headerName: 'Balance-All',
          field: 'all_balance',
          filter: 'agTextColumnFilter',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: this.helper.CurrencyCellRendererRollForwardLog,
          cellClass: "exportValueTwoDecimalPlaces",
          hide: !this.rollforward_to_adjust_collateral
          // hide: true
        },
      ];
      this.rollForwordLogsRowData = <any>JSON.parse(response._body).rollforward_logs;
      this.rollForwordLogsRowData.map(elm => {
        if (elm.division_code_id === -1 || elm.division_code_id === null) {
          elm.division_code_id = elm.division_code_id;
        }
        else {
          elm.division_code_id = elm.division_code_id.toString() + "-D";
        }
      });
      this.rollForwardLogGridOptions.api.refreshCells();
    });
  }

	/**
   * on row selected selected rows will be edited or deleted
   * 
   */
  onRowSelected(event: any) {
    this.systemGeneratedRows = 0;
    this.selectedRolls = this.rollForwardLogGridOptions.api.getSelectedRows();
    this.selectedRolls.forEach(element => {
      if (element.user.toLowerCase() === "system") {
        this.systemGeneratedRows++;
      }
    });
    if (this.systemGeneratedRows === this.rollForwordLogsRowData.length) {
      this.selectedRolls = [];
    }
  }

	/**
   * on click edit button open popup to edit
   * 
   */
  editRollForwardLogData(event: any) {
    let selectedManualRolls = this.rollForwardLogGridOptions.api.getSelectedRows();
    const dialogRef = this.dialog.open(RollForwardEditPopupDetailsComponent, {
      height: 'auto',
      width: "97vw",
      autoFocus: false,
      disableClose: true,
      data: { selectedRollForwardlog: selectedManualRolls, rollforward_to_adjust_collateral: this.rollforward_to_adjust_collateral },
      panelClass: 'full-width-dialog-invoice'
    });
  }
  /**
   * Add Button Form Open Dialog box
   */
  addRollForwardLogData() {
    const dialogRef = this.dialog.open(RollfrowardAddDetailsComponent, {
      height: '230px',
      width: "100vw",
      disableClose: true,
      data: { selectedRollForwardlog: this.selectedRolls, rollforward_to_adjust_collateral: this.rollforward_to_adjust_collateral },
      autoFocus: false,
      panelClass: 'full-width-dialog-invoice'
    });
  }

  /**
   * Delate Button Action Icon
   */
  deleteRollforwardLogData() {
    const popupParams = { 'title': 'Confirmation', message: 'Are you sure you want to delete?' }
    this.helper.openConfirmPopup(popupParams).subscribe(result => {
      if (result === true) {
        let ids = [];
        let deleteRows = this.rollForwardLogGridOptions.api.getSelectedRows();
        deleteRows = deleteRows.filter(elm => {
          return elm.user.toLowerCase() === "manual";
        })
        deleteRows.forEach(element => {
          ids.push(element.id)
        });
        const url = this._apiMapper.endpoints[CyncConstants.DELETE_ROLLFORWARD_DATA].replace('{clientId}', this.clientId).replace('{ids}', ids);
        this.bbcReviewService.deleteRollForwardLogService(url).subscribe(response => {
          const message = 'Deleted Successfully';
          this.selectedRolls = [];
          this.helper.showApiMessages(message, 'success');
          this.loadDefaultRollForwardData();
          this.rollForwardLogGridOptions.api.refreshCells();
        });
      }

    });
  }

  refresh(params: any): boolean {
    return false;
  }
  /*
  *format activity date
  */
  dateFormatter(params: any) {
    return moment(params.value).format('MM/DD/YYYY');
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
  * Model updated method
  * @param data 
  */
  modelUpdatedMethod(data: any){
    this.rollForwardLogGridOptions.api.sizeColumnsToFit();
  }
}
