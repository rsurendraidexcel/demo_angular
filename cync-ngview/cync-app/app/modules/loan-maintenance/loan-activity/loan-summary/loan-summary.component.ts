
import { Component, OnInit, Input, ViewChild, ViewEncapsulation, NgZone } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';

import * as moment from 'moment-timezone';
import { LoanSummaryService } from './loan-summary.service';
import { CustomDatePickerComponentLoanSummary, } from './custom-datepicker/custom-datepicker.component';
import { LoanDocumentComponent } from './loan-document/loan-document.component';


@Component({
	selector: 'app-loan-summary',
	templateUrl: './loan-summary.component.html',
	styleUrls: ['./loan-summary.component.scss']
})
export class LoanSummaryComponent implements OnInit {

	public gridApi;
	public gridOptions: GridOptions;
	public gridColumnApi;
	public columnDefs;
	public defaultColDef;
	public rowSelection;
	public rowData: any[];
	public statusBar;
	public excelStyles;
	public frameworkComponents;
	isDataLoaded = false;
	decimalPrecision = 2;
	exceldecimalPrecision = '00';
	rowDataObject: any;
	isRowDetailsPopupOpen: boolean = false;
	public params: any;

	constructor(
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private _message: MessageServices,
		private _loanSummaryService: LoanSummaryService,
		private _commonApi: CommonAPIs,
		private router: Router,
		private ngZone: NgZone
	) { }

	ngOnInit() {
		this._message.showLoader(true);
		this.initializeColumnDefination();
		this.initializeLoanSummaryData();
		this.defaultColDef = {
			resizable: true,
			sortable: true,
			headerCheckboxSelection: this.isFirstColumn,
			checkboxSelection: this.isFirstColumn
		};
		this.rowSelection = "multiple";
		this.statusBar = {
			statusPanels: [
				{
					statusPanel: "agTotalRowCountComponent",
					align: "center"
				},
				{
					statusPanel: "agFilteredRowCountComponent"
				},
				{
					statusPanel: "agSelectedRowCountComponent"
				}
			]
		};
		this.gridOptions = {
			context: { parentComponent: this },
			localeText: {
				noRowsToShow: 'No Records Found'
			},
			onFilterChanged: function (event) {
				event.api.deselectAll();
			}
		};
		this.frameworkComponents = { agDateInput: CustomDatePickerComponentLoanSummary };
		this.excelStyles = [
			{
				id: "exportColumnClass",
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 10,
					bold: false
				}
			},
			{
				id: "header",
				interior: {
					color: "#D9E5F6",
					pattern: "Solid"
				},
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 11,
					bold: true
				}
			},
			{
				id: "exportValueTwoDecimalPlaces",
				numberFormat: { format: "#,##0." + this.exceldecimalPrecision },
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 10,
					bold: false
				}
			},
			{
				id: "excelHeader",
				interior: {
					color: "#AECCF8",
					pattern: "Solid"
				},
				borders: {
					borderBottom: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderLeft: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderRight: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					},
					borderTop: {
						color: "#000",
						lineStyle: "Continuous",
						weight: 1
					}
				},
				font: {
					fontName: "Calibri Light",
					color: "#000",
					size: 11,
					bold: true
				}
			}
		];
	}

	agInit(params) {
		this.params = params;
	}

	/**
	* First column as checkbox selection
	* @param params 
	*/
	isFirstColumn(params) {
		let displayedColumns = params.columnApi.getAllDisplayedColumns();
		let thisIsFirstColumn = displayedColumns[0] === params.column;
		return thisIsFirstColumn;
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;
		// this.gridApi.sizeColumnsToFit();
	}

	/**
	* Initialized grid column defination
	*/
	initializeColumnDefination() {
		const url = (this._apiMapper.endpoints[CyncConstants.GRID_CONFIG_API_URL]).replace('{id}', 'loan_summary');
		this._loanSummaryService.getGridConfig(url).subscribe(result => {
			let data = result.data

			let defaultCol = [
				{
					headerName: "Loan Origination Date",
					headerTooltip: 'Loan Origination Date',
					colId: "Loan_Origination_Date",
					field: "Loan_Origination_Date",
					valueFormatter: this.dateValueFormatter,
					// valueFormatter : (dt) => {
					// 	return this._helper.getCyncDateFormate(dt.value);
					// },
					filter: 'agDateColumnFilter',
					cellStyle: { 'text-align': "left" },
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
					headerName: "Loan Maturity Date",
					headerTooltip: 'Loan Maturity Date',
					colId: "Loan_Maturity_Date",
					field: "Loan_Maturity_Date",
					valueFormatter: this.dateValueFormatter,
					// valueFormatter : (dt) => {
					// 	return this._helper.getCyncDateFormate(dt.value);
					// },
					filter: 'agDateColumnFilter',
					cellStyle: { 'text-align': "left" },
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
					headerName: "Loan ID",
					headerTooltip: 'Loan ID',
					colId: "Loan_ID",
					field: "Loan_ID",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Client",
					headerTooltip: 'Client',
					colId: "client",
					field: "client",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Outstanding Account Balance",
					headerTooltip: 'Outstanding Account Balance',
					colId: "outstanding_account_balance",
					field: "outstanding_account_balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Outstanding Loan Balance",
					headerTooltip: 'Outstanding Loan Balance',
					colId: "Outstanding_Loan_Balance",
					field: "Outstanding_Loan_Balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Loan Type",
					headerTooltip: 'Loan Type',
					colId: "Loan_Type",
					field: "Loan_Type",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Disbursement",
					headerTooltip: 'Disbursement',
					colId: "Disbursement",
					field: "Disbursement",
					filter: 'agNumberColumnFilter',
					valueFormatter: this.currencyValueFormatter,
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Principal Paid",
					headerTooltip: 'Principal Paid',
					colId: "Principal_Paid",
					field: "Principal_Paid",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Principal Balance",
					headerTooltip: 'Principal Balance',
					colId: "Principal_Balance",
					field: "Principal_Balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Interest Paid",
					headerTooltip: 'Interest Paid',
					colId: "Interest_Paid",
					field: "Interest_Paid",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Fee Paid",
					headerTooltip: 'Fee Paid',
					colId: "Fee_Paid",
					field: "Fee_Paid",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Interest Accrued",
					headerTooltip: 'Interest Accrued',
					colId: "Interest_Accrued",
					field: "Interest_Accrued",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Interest Balance",
					headerTooltip: 'Interest Balance',
					colId: "Interest_Balance",
					field: "Interest_Balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Fee Accrued",
					headerTooltip: 'Fee Accrued',
					colId: "Fee_Accrued",
					field: "Fee_Accrued",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Fee Balance",
					headerTooltip: 'Fee Balance',
					colId: "Fee_Balance",
					field: "Fee_Balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Credit Ceiling Max",
					headerTooltip: 'Credit Ceiling Max',
					colId: "Credit_Ceiling_Max",
					field: "Credit_Ceiling_Max",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Client ID",
					headerTooltip: 'Client ID',
					colId: "client_id",
					field: "client_id",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Loan Status",
					headerTooltip: 'Loan Status',
					colId: "Loan_Status",
					field: "Loan_Status",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Interest %",
					headerTooltip: 'Interest %',
					colId: "Interest%",
					field: "Interest%",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Loan Documents",
					headerTooltip: 'Loan Documents',
					colId: "Loan_Documents",
					field: "Loan_Documents",
					cellRendererFramework: LoanDocumentComponent,
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Loan Signed Date",
					headerTooltip: 'Loan Signed Date',
					colId: "Loan_Signed_Date",
					field: "Loan_Signed_Date",
					valueFormatter: this.dateValueFormatter,
					// valueFormatter : (dt) => {
					// 	return this._helper.getCyncDateFormate(dt.value);
					// },
					filter: 'agDateColumnFilter',
					cellStyle: { 'text-align': "left" },
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
					headerName: "Loan Paid Off Date",
					headerTooltip: 'Loan Paid Off Date',
					colId: "Loan_Paid_Off_Date",
					field: "Loan_Paid_Off_Date",
					valueFormatter: this.dateValueFormatter,
					// valueFormatter : (dt) => {
					// 	return this._helper.getCyncDateFormate(dt.value);
					// },
					filter: 'agDateColumnFilter',
					cellStyle: { 'text-align': "left" },
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
					headerName: "Interest Amount",
					headerTooltip: 'Interest Amount',
					colId: "interest_amount",
					field: "interest_amount",
					filter: 'agNumberColumnFilter',
					valueFormatter: this.currencyValueFormatter,
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Other Fees",
					headerTooltip: 'Other Fees',
					colId: "other_fees",
					field: "other_fees",
					filter: 'agNumberColumnFilter',
					valueFormatter: this.currencyValueFormatter,
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				}
			];

			// Check if there is saved configuration in server and then we change the col def based on saved config.
			if (data) {
				defaultCol.forEach(function (col, index) {
					let config_data = data.filter(function (obj) { return obj.col_id === col.colId })
					if (config_data.length > 0) {
						col["hide"] = false;
						col['pivotIndex'] = config_data[0].index

					} else {
						col["hide"] = true;
						col['pivotIndex'] = index
					}
				});
				defaultCol.sort((x, y) => x['pivotIndex'] > y['pivotIndex'] ? 1 : -1)
			}
			this.columnDefs = defaultCol;
		});
	}

	/**
  	* Initialize Loan Summary List Data
  	*/
	initializeLoanSummaryData() {
		let url = this._apiMapper.endpoints[CyncConstants.GET_LOAN_SUMMARY_LIST];
		this._loanSummaryService.getLoanSummaryDataList(url).subscribe(res => {
			this.isDataLoaded = true;
			this.rowData = res.data;
			this._message.showLoader(false);
		}, error => {
			this.isDataLoaded = false;
			this._message.showLoader(false);
		});
	};

	/**
	* Currency Value Formatter
	*/
	currencyValueFormatter(params: any): string {
		let usdFormate = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: params.context.parentComponent.decimalPrecision,
			currency: 'USD',
			style: "decimal"
		});
		if (params.value != null && params.value != undefined && params.value != '') {
			//return usdFormate.format(params.value);
			let usdFormatedValue = usdFormate.format(params.value);
			if (usdFormatedValue.indexOf('-') !== -1) {
				return "(" + usdFormatedValue.replace('-', '') + ")"; // Format negative value with ()
			} else {
				return usdFormatedValue;
			}
		} else {
			return usdFormate.format(0);
		}
	}

	/**
	* Date value fomatter
	* @param params 
	*/
	dateValueFormatter(params) {
		if (params.value != null && params.value != undefined && params.value != '') {
			return moment(params.value).format(CyncConstants.DATE_FORMAT);
		} else {
			return params.value;
		}
	}

	/**
	* Export button enable or disable according to grid data conditions
	*/
	isExportButtonDisable() {
		if (this.rowData && this.rowData.length > 0) {
			return true;
		} else {
			return false;
		}
	}

	/***
	* This method export the file into excel format
	*/
	exportExcel() {

		let selectedRows = this.gridApi.getSelectedRows();
		let onlySelectedRowData = false;

		// Get array of ag-grid display header fields
		let gridHeaderKeys = [];
		(this.gridColumnApi.getAllDisplayedColumns()).forEach((e, i) => {
			if (e.colId != undefined) {
				gridHeaderKeys.push(e.colId);
			}
		});

		if (selectedRows.length > 0) {
			onlySelectedRowData = true; // Export only selected row data
		}

		let params = {
			columnKeys: gridHeaderKeys,
			fileName: 'loan-summary',
			onlySelected: onlySelectedRowData,
			rowHeight: 15,
			headerRowHeight: 20,
			sheetName: 'Sheet1',
			customHeader: [
				[{
					styleId: "excelHeader",
					data: {
						type: "String",
						value: "Loan Summary Export"
					},
					mergeAcross: gridHeaderKeys.length - 1
				}]
			]
		};

		if (gridHeaderKeys.length > 0) {
			this.gridApi.exportDataAsExcel(params);
		} else {
			this._helper.showApiMessages(CyncConstants.EXPORT_EXCEL_ERROR_MESSAGE, 'danger');
		}
	}

	/**
	* Cell mouse over event
	* @param event 
	*/
	cellMouseOver(event: any) {
		if (this.isRowDetailsPopupOpen) {
			this.showRowDetailsPopup(event);
		}
	}

	/**
	* Close method for row details
	*/
	closeRowDetailsPopup() {
		this.rowDataObject = '';
		this.isRowDetailsPopupOpen = false;
	}

	/**
	* On Row click event method
	* @param e 
	*/
	public onRowClicked(e) {
		this.isRowDetailsPopupOpen = true;
		this.showRowDetailsPopup(e);
	}

	/**
	* Show row details popup
	* @param event 
	*/
	showRowDetailsPopup(event: any) {
		this.rowDataObject = event.data;
		if (this.rowDataObject) {

			// // Get array of ag-grid header fields
			// let filteredKeys = [];
			// this.columnDefs.forEach((e, i) => {
			// 	if(e.field != undefined){
			// 		filteredKeys.push(e.field);
			// 	}
			// });

			// Get array of ag-grid display header fields
			let gridHeaderKeys = [];
			(this.gridColumnApi.getAllDisplayedColumns()).forEach((e, i) => {
				if (e.colId != undefined) {
					gridHeaderKeys.push(e.colId);
				}
			});

			// Bind ag-grid fields value
			this.rowDataObject = gridHeaderKeys.reduce((obj, key) => ({ ...obj, [key]: this.rowDataObject[key] }), {});

			// Map key with ag-grid header value
			let tempFilterObj = {};
			for (var key in this.rowDataObject) {
				let filteredObject = (this.columnDefs).filter(function (obj) {
					return obj.field === key;
				});
				if ((this.rowDataObject).hasOwnProperty(key)) {
					if (
						key == 'Interest%' || key == 'Credit_Ceiling_Max' ||
						key == 'Disbursement' || key == 'Principal_Paid' ||
						key == 'Principal_Balance' || key == 'Interest_Accrued' ||
						key == 'Interest_Paid' || key == 'Interest_Balance' ||
						key == 'interest_amount' || key == 'other_fees' ||
						key == 'Fee_Accrued' || key == 'Fee_Paid' ||
						key == 'Fee_Balance' || key == 'Outstanding_Loan_Balance' || key == 'outstanding_account_balance'
					) {
						if (this.rowDataObject[key]) {
							tempFilterObj[filteredObject[0].headerName] = this.rowDetailValueFormatter(this.rowDataObject[key]);
						} else {
							tempFilterObj[filteredObject[0].headerName] = this.rowDetailValueFormatter(0);
						}
					} else {
						tempFilterObj[filteredObject[0].headerName] = this.rowDataObject[key];
					}
				}
			}
			this.rowDataObject = tempFilterObj;
		}
	}

	/**
	* Row Details Currency Value Formatter
	*/
	rowDetailValueFormatter(value: any): string {
		let usdFormate = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: this.decimalPrecision,
			currency: 'USD',
			style: "decimal"
		});
		if (value != null && value != undefined && value != '') {
			let usdFormatedValue = usdFormate.format(value);
			if (usdFormatedValue.indexOf('-') !== -1) {
				return "(" + usdFormatedValue.replace('-', '') + ")"; // Format negative value with ()
			} else {
				return usdFormatedValue;
			}
		} else {
			return usdFormate.format(0);
		}
	}

	/**
	* Keep Original Order of Side bar table data
	*/
	public keepOriginalOrder = (a, b) => {
		return a.key;
	};

	/**
	* On Grid column change event
	* @param event 
	*/
	onGridColumnsChanged(event) {
		const url = (this._apiMapper.endpoints[CyncConstants.GRID_CONFIG_API_URL]).replace('{id}', 'loan_summary');
		let requestBody = [];
		event.columnApi.getAllDisplayedColumns().forEach((obj, index) => requestBody.push({ 'index': index, col_id: obj.colId }))
		this._loanSummaryService.saveGridConfig(url, requestBody).subscribe(data => { });
	};
}
