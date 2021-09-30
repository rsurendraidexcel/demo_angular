import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { BrokerService } from '../service/broker.service';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { BrokerInquiryExportStyle } from '../model/broker-inquiry';
import * as moment from 'moment-timezone';
import { CustomDatePickerComponent } from '@app/shared/components/custom-datepicker.component';

@Component({
	selector: 'app-broker-inquiry',
	templateUrl: './broker-inquiry.component.html',
	styleUrls: ['./broker-inquiry.component.scss']
})
export class BrokerInquiryComponent implements OnInit {

	brokerInquiryRowData: any;
	brokerInquiryColoumnDefs: any;
	brokerInquiryGridApi: any;
	brokerInquiryGridParams: any;
	brokerInquiryGridOptions: GridOptions;
	brokerInquiryGridColumnApi: any;
	brokerInquiryDefaultColDef: any;
	public excelStyles: any;
	isDataLoaded: boolean;
	frameworkComponents:any;

	constructor(
		private _brokerService: BrokerService,
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private _message: MessageServices
	) {

		this.isDataLoaded = false;
		this.brokerInquiryGridOptions = {
			columnDefs: this.brokerInquiryColoumnDefs,
			enableBrowserTooltips: true,
			// localeText: {
			// 	noRowsToShow: 'No Records Found'
			// }
		}

		/**
        * Initialized grid column defination
        */
		this.brokerInquiryColoumnDefs = [
			{
				headerName: "Client Name",
				field: "client_name",
				filter: 'agTextColumnFilter',
				tooltipField: 'client_name',
				headerTooltip: 'Client Name',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
			},
			{
				headerName: "Account No",
				field: "account_no",
				filter: 'agTextColumnFilter',
				tooltipField: 'account_no',
				headerTooltip: 'Account No',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass",
			},
			{
				headerName: "Account Name",
				field: "account_name",
				filter: 'agTextColumnFilter',
				tooltipField: 'account_name',
				headerTooltip: 'Account Name',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
			},
			{
				headerName: "Broker Name",
				field: "broker_name",
				filter: 'agTextColumnFilter',
				tooltipField: 'broker_name',
				headerTooltip: 'Broker Name',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
				
			},
			{
				headerName: "Invoice No",
				field: "receivable_no",
				filter: 'agTextColumnFilter',
				tooltipField: 'receivable_no',
				headerTooltip: 'Invoice No',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass",
				
			},
			{
				headerName: "Invoice Amount",
				field: "original_amount",
				filter: 'agTextColumnFilter',
				headerTooltip: 'Invoice Amount',
				cellStyle: { 'text-align': 'right' },
				resizable: true,
				valueFormatter: this._helper.CurrencyCellRendererRoundOff,
				cellClass: "exportValueTwoDecimalPlaces",
				comparator: this.customSort
			},
			{
				headerName: "Balance Amount",
				field: "current_amount",
				filter: 'agTextColumnFilter',
				headerTooltip: 'Balance Amount',
				cellStyle: { 'text-align': 'right' },
				cellClass: "exportValueTwoDecimalPlaces",
				valueFormatter: this._helper.CurrencyCellRendererRoundOff,
				resizable: true,
				comparator: this.customSort
			},
			{
				headerName: "Advance Amount",
				field: "advance_amount",
				filter: 'agTextColumnFilter',
				headerTooltip: 'Advance Amount',
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this._helper.CurrencyCellRendererRoundOff,
				cellClass: "exportValueTwoDecimalPlaces",
				resizable: true,
				comparator: this.customSort
			},
			{
				headerName: "Factoring Fee",
				field: "fee_amount_on_accured",
				filter: 'agTextColumnFilter',
				headerTooltip: 'Factoring Fee',
				cellStyle: { 'text-align': 'right' },
				cellClass: "exportValueTwoDecimalPlaces",
				valueFormatter: this._helper.CurrencyCellRendererRoundOff,
				resizable: true,
				comparator: this.customSort
			},
			{
				headerName: "Commission%",
				field: "broker_commission_pct",
				filter: 'agTextColumnFilter',
				headerTooltip: 'Commission%',
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this._helper.CurrencyCellRendererRoundOff,
				cellClass: "exportValueTwoDecimalPlaces",
				resizable: true,
				comparator: this.customSort
			},
			{
				headerName: "Broker Fee",
				field: "broker_fee_amount",
				filter: 'agTextColumnFilter',
				headerTooltip: 'Broker Fee',
				cellStyle: { 'text-align': 'right' },
				valueFormatter: this._helper.CurrencyCellRendererRoundOff,
				cellClass: "exportValueTwoDecimalPlaces",
				resizable: true,
				comparator: this.customSort
			},
			{
				headerName: "Broker Fee Status",
				field: "broker_fee_status",
				filter: 'agTextColumnFilter',
				tooltipField: 'broker_fee_status',
				headerTooltip: 'Broker Fee Status',
				cellStyle: { 'text-align': 'left' },
				resizable: true,
				filterParams: {
					textFormatter: (val) => val,
					textCustomComparator: this.getFilterTextValue
				},
				cellClass: "exportColumnClass"
			},
			{
				headerName: "Fee Paid On",
				field: "broker_fee_paid_dt",
				filter: 'agDateColumnFilter',
				tooltipField: 'broker_fee_paid_dt',
				headerTooltip: 'Fee Paid On',
				cellClass: "exportColumnClass",
				resizable: true,
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
			
		];

		this.brokerInquiryDefaultColDef = {
			sortable: true,
			filter: true,
		};
		this.frameworkComponents = { agDateInput: CustomDatePickerComponent };
		this.brokerInquiryRowData = [];
		this.excelStyles = BrokerInquiryExportStyle.setGridExportStyle();
	}

	ngOnInit() {
	
		this.getBrokerInquiryDetails();
	}

    /**
    * Initialize Broker Enquiry List Data
    */
	getBrokerInquiryDetails() {
		this._message.showLoader(true);
		const url = this._apiMapper.endpoints[CyncConstants.BROKER_INQUIRY_LIST];
		this._brokerService.getBrokerInquiryDetails(url).subscribe(response => {
			this.isDataLoaded = true;
			this.brokerInquiryRowData = <any>JSON.parse(response._body);
			this._message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this._message.showLoader(false);
		});
	}

	brokerInquiryOnGridReady(params: any) {
		this.brokerInquiryGridParams = params;
		this.brokerInquiryGridApi = params.api;
		this.brokerInquiryGridColumnApi = params.columnApi;	
		this.brokerInquiryGridApi.showLoadingOverlay();
	}

	onModelUpdated($event) {
		if (this.brokerInquiryGridApi && this.brokerInquiryGridApi.rowModel.rowsToDisplay.length == 0) {
			this.brokerInquiryGridApi.showNoRowsOverlay();
		}
		if (this.brokerInquiryGridApi && this.brokerInquiryGridApi.rowModel.rowsToDisplay.length > 0) {
			this.brokerInquiryGridApi.hideOverlay();
		}
	}

	/**
    * Export button enable or disable according to grid data conditions
    */
	isExportButtonDisable() {
		if (this.brokerInquiryRowData && this.brokerInquiryRowData.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	/**
    *Refresh button enable or disable according to grid data conditions
    */
	isRefreshButtonDisable()
	{
		if (this.brokerInquiryRowData && this.brokerInquiryRowData.length > 0) {
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
		(this.brokerInquiryGridColumnApi.getAllDisplayedColumns()).forEach((e, i) => {
			if (e.colId != undefined) {
				gridHeaderKeys.push(e.colId);
			}
		});
		let params = {
			columnKeys: gridHeaderKeys,
			fileName: 'broker-inquiry',
			rowHeight: 15,
			headerRowHeight: 20,
			sheetName: 'Sheet1',
			customHeader: [
				[{
					styleId: "excelHeader",
					data: {
						type: "String",
						value: "Broker Inquiry Report"
					},
					mergeAcross: gridHeaderKeys.length - 1
				}]
			]
		};
		if (gridHeaderKeys.length > 0) {
			this.brokerInquiryGridApi.exportDataAsExcel(params);
		}
		else {
			this._helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'error');
		}
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
	 * This method reset broker commission data
	 * 
	 */
	redrawAllRows() {
		 this.getBrokerInquiryDetails();
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