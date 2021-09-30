
import { Component, OnInit, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { Helper } from '@cyncCommon/utils/helper';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { Router, ActivatedRoute } from '@angular/router';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { LoanEnquiryService } from './loan-enquiry.service';
import { LoanEnquiryModel } from './loan-enquiry.model';
import * as moment from 'moment-timezone';
import { CustomDatePickerComponent } from "./custom-datepicker.component";
import { CheckImageComponent } from './check-images/check-images-component';
import { FromToDateSearchModel } from '@cyncCommon/component/from-to-date-search/from-to-date-search.model';
import { EventSourcePolyfill } from 'ng-event-source';
import { CustomStatusBarComponent } from "./custom-status-bar.component";


@Component({
	selector: 'app-loan-enquiry',
	templateUrl: './loan-enquiry.component.html',
	styleUrls: ['./loan-enquiry.component.scss']
})

export class LoanEnquiryComponent implements OnInit {

	public gridApi;
	public overlayLoadingTemplate;
	public gridOptions: GridOptions;
	public gridColumnApi;
	public columnDefs;
	public defaultColDef;
	public rowSelection;
	public rowData: any[];
	public statusBar;
	public excelStyles;
	public frameworkComponents;
	decimalPrecision = 2;
	exceldecimalPrecision = '00';
	rowDataObject: any;
	isRowDetailsPopupOpen: boolean = false;
	from_date: Date;
	to_date: Date;
	fromToDateSearchModel: FromToDateSearchModel;
	pageIndex: any;
	loanSubscription: any;
	userRoleId:any;
	userRoleType:any;
	borrower_date:any;


	constructor(
		private _apiMapper: APIMapper,
		private _helper: Helper,
		private _message: MessageServices,
		private _loanEnquiryService: LoanEnquiryService,
		private _commonApi: CommonAPIs,
		private router: Router,
		private route: ActivatedRoute
	) {
		
		this.userRoleId = localStorage.getItem(CyncConstants.CYNC_USER_ROLE_ID);/*Logged In User*/
		this.userRoleType = localStorage.getItem(CyncConstants.CYNC_USER_ROLE);
		//this.userRoleType = 'Borrower';
		var currentDate = new Date(this._helper.convertDateToString(new Date()));
		if(this.userRoleType === 'Borrower'){
			let url = "loan_inquery/loan_origination_date_for_borrower_role"
			this._loanEnquiryService.getBorrowerTransactionDate(url).subscribe(result =>{
				let from_date;
				if(result){
					from_date = new Date(result.from_date.activity_date);
					this.fromToDateSearchModel = {
						'type': "loan-inquiry",
						'from_date': from_date,
						'to_date': new Date(this._helper.convertDateToString(new Date()))
					};
				}
				let to_date = new Date(this._helper.convertDateToString(new Date()));
				this.initializeLoanEnquiryData(from_date, to_date);
			})

	
		}

		else {
			this.fromToDateSearchModel = {
				'type': "loan-inquiry",
				'from_date': new Date(currentDate.setDate(currentDate.getDate() - 90)),
				'to_date': new Date(this._helper.convertDateToString(new Date()))
			};
			
			let to_date = new Date(this._helper.convertDateToString(new Date()));
			let today =  new Date(this._helper.convertDateToString(new Date()));
			let from_date = new Date(today.setDate(today.getDate() - 90));
			//console.log("comming here", today, this.from_date);
			this.initializeLoanEnquiryData(from_date, to_date);
		}
	
		// display loading message in ag-grid
		this.overlayLoadingTemplate =
		'<span class="ag-overlay-loading-center">Please wait, The data is being prepared</span>';
	}

	ngOnInit() {


		//console.log(this.userRoleId, this.userRoleType);
	
		let currentDate = new Date(this._helper.convertDateToString(new Date()));

			// let url = "loan_inquery/loan_origination_date_for_borrower_role";
			// this._loanEnquiryService.getBorrowerTransactionDate(url).subscribe(result =>{
				
			// 		let fdate = new Date(result.from_date);
			// 		console.log(fdate);
				
			// })

		
		this._message.showLoader(true);
		this.initializeColumnDefination();
		
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
					statusPanel: 'customStatusBarComponent'
				},
				// {
				// 	statusPanel: "agTotalRowCountComponent",
				// 	align: "center"
				// },
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
		this.frameworkComponents = { agDateInput: CustomDatePickerComponent, customStatusBarComponent: CustomStatusBarComponent };
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
		const url = (this._apiMapper.endpoints[CyncConstants.GRID_CONFIG_API_URL]).replace('{id}', 'loan_inquery');
		this._loanEnquiryService.getGridConfig(url).subscribe(result => {
			let data = result.data
			let defaultCol = [
				{
					headerName: "Effective Date",
					headerTooltip: 'Effective Date',
					colId: "effective_date",
					field: "effective_date",
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
					colId: "loan_id",
					field: "loan_id",
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
					headerName: "Charge Code",
					headerTooltip: 'Charge Code',
					colId: "charge_code",
					field: "charge_code",
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
					headerName: "Disbursement",
					headerTooltip: 'Disbursement',
					colId: "disbursement",
					field: "disbursement",
					filter: 'agNumberColumnFilter',
					valueFormatter: this.currencyValueFormatter,
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Principal Paid",
					headerTooltip: 'Principal Paid',
					colId: "principal_paid",
					field: "principal_paid",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Principal Balance",
					headerTooltip: 'Principal Balance',
					colId: "principal_balance",
					field: "principal_balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Repayment",
					headerTooltip: 'Repayment',
					colId: "repayment",
					field: "repayment",
					filter: 'agNumberColumnFilter',
					valueFormatter: this.currencyValueFormatter,
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Interest Paid",
					headerTooltip: 'Interest Paid',
					colId: "interest_paid",
					field: "interest_paid",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Fee Paid",
					headerTooltip: 'Fee Paid',
					colId: "fee_paid",
					field: "fee_paid",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Interest Accrued",
					headerTooltip: 'Interest Accrued',
					colId: "interest_accrued",
					field: "interest_accrued",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Interest Balance",
					headerTooltip: 'Interest Balance',
					colId: "interest_balance",
					field: "interest_balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Fee Accrued",
					headerTooltip: 'Fee Accrued',
					colId: "fee_accrued",
					field: "fee_accrued",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Fee Balance",
					headerTooltip: 'Fee Balance',
					colId: "fee_balance",
					field: "fee_balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Outstanding Loan Balance",
					headerTooltip: 'Outstanding Loan Balance',
					colId: "outstanding_loan_balance",
					field: "outstanding_loan_balance",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Posted Date",
					headerTooltip: 'Posted Date',
					colId: "posted_date",
					field: "posted_date",
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
					headerName: "Disbursement ID",
					headerTooltip: 'Disbursement ID',
					colId: "disbursement_id",
					field: "disbursement_id",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Interest %",
					headerTooltip: 'Interest %',
					colId: "interest_pct",
					field: "interest_pct",
					valueFormatter: this.currencyValueFormatter,
					filter: 'agNumberColumnFilter',
					cellStyle: { 'text-align': "right" },
					cellClass: "exportValueTwoDecimalPlaces"
				},
				{
					headerName: "Loan Status",
					headerTooltip: 'Loan Status',
					colId: "loan_status",
					field: "loan_status",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
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
					headerName: "Loan Type",
					headerTooltip: 'Loan Type',
					colId: "loan_type",
					field: "loan_type",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: 'Check Images',
					headerTooltip: 'Check Images',
					colId: "check_image",
					field: 'check_image',
					cellRendererFramework: CheckImageComponent,
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Payor",
					headerTooltip: 'Payor',
					colId: "payer_name",
					field: "payer_name",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Payor ID",
					headerTooltip: 'Payor ID',
					colId: "payer_id",
					field: "payer_id",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Source Type",
					headerTooltip: 'Source Type',
					colId: "transaction_type",
					field: "transaction_type",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Batch No.",
					headerTooltip: 'Batch No.',
					colId: "batch_no",
					field: "batch_no",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Check No.",
					headerTooltip: 'Check No.',
					colId: "check_no",
					field: "check_no",
					filter: 'agTextColumnFilter',
					cellStyle: { 'text-align': "left" },
					cellClass: "exportColumnClass"
				},
				{
					headerName: "Loan Signed Date",
					headerTooltip: 'Loan Signed Date',
					colId: "loan_signed_date",
					field: "loan_signed_date",
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
					headerName: "Source BBC Date",
					headerTooltip: 'Source BBC Date',
					colId: "source_bbc_date",
					field: "source_bbc_date",
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
  	* Initialize Loan Enquiry List Data
  	*/
	initializeLoanEnquiryData(fromdate?, todate?, cPage: any = 1) {
		this.from_date = fromdate;
		this.to_date = todate;
		
		let fromDateValue = '';
		let toDateValue = '';
		if (this.from_date != undefined && this.from_date != null && this.to_date != undefined && this.to_date != null) {
			fromDateValue = moment(this.from_date, CyncConstants.REPORT_FILE_DATE_FORMAT).format(CyncConstants.REPORT_FILE_DATE_FORMAT);
			toDateValue = moment(this.to_date, CyncConstants.REPORT_FILE_DATE_FORMAT).format(CyncConstants.REPORT_FILE_DATE_FORMAT);
		}

		let url = this._apiMapper.endpoints[CyncConstants.GET_LOAN_ACTIVITY_LOAN_ENQUIRY_LIST] + '?from_date=' + fromDateValue + "&to_date=" + toDateValue + '&page=' + cPage;
		if (this.loanSubscription !== undefined) {
			this.loanSubscription.unsubscribe();
		}
		this.loanSubscription = this._loanEnquiryService.getLoanEnquiryDataList(url).subscribe(res => {
			//this.rowData = res.data;
			//this._message.showLoader(false);
			this.onMessageHandler(res, this)
		}, error => {
			this._message.showLoader(false);
			this.gridApi.hideOverlay();
		});

		// let that = this;
		// that.pageIndex = 1;
		// let URL = this._loanEnquiryService.getAPIBaseUrl('MCL') + this._apiMapper.endpoints[CyncConstants.GET_LOAN_ENQUIRY_STREAM_DATA_URL].replace('{from_date}', fromDateValue).replace('{to_date}',toDateValue);
		// let source = new EventSourcePolyfill(URL,  { headers: {"Authorization": this._loanEnquiryService.getBearerToken()}});
		// source.addEventListener('message', (event) => that.onMessageHandler(event,that),false);
	};

	/**
	* Ng Event Source Message handler
	* @param event 
	* @param that 
	*/
	onMessageHandler(event, that) {
		let fromDateValue = '';
		let toDateValue = '';
		if (that.from_date != undefined && that.from_date != null && that.to_date != undefined && that.to_date != null) {
			fromDateValue = moment(that.from_date, CyncConstants.REPORT_FILE_DATE_FORMAT).format(CyncConstants.REPORT_FILE_DATE_FORMAT);
			toDateValue = moment(that.to_date, CyncConstants.REPORT_FILE_DATE_FORMAT).format(CyncConstants.REPORT_FILE_DATE_FORMAT);
		}
		let response = event;
		if (parseInt(response.current_page) === 1) {
			that.rowData = response.data;
			that._loanEnquiryService.setTotalRowCount({ displayRowCount: that.rowData.length, totalRowCount: response['total_records'] })
		} else {
			that.gridApi.updateRowData({ add: response.data });
			that._loanEnquiryService.setTotalRowCount({ displayRowCount: this.gridOptions.api.getDisplayedRowCount(), totalRowCount: response['total_records'] })
		}

		that._message.showLoader(false);
		//event.target.close();
		if ((response.current_page) < response.total_pages) {
			// let next_index = (parseInt(response.page_index)+1);
			// let URL = this._loanEnquiryService.getAPIBaseUrl('MCL') + this._apiMapper.endpoints[CyncConstants.GET_LOAN_ENQUIRY_STREAM_DATA_URL].replace('{from_date}', fromDateValue).replace('{to_date}',toDateValue);
			// let finalURL = URL +'&page_index='+ next_index + "&page_key=" + response.page_key;
			// let sourceNew = new EventSourcePolyfill(finalURL, { headers: { "Authorization": this._loanEnquiryService.getBearerToken()}});
			//   	sourceNew.addEventListener('message', (event) => that.onMessageHandler(event,that),false);
			this.initializeLoanEnquiryData(this.from_date, this.to_date, response.current_page + 1)
		} else {
			// that._loanEnquiryService.setTotalRowCount({ displayRowCount: that.rowData.length, totalRowCount: response['total_records'] })
			if(response.current_page === 1){
				 that._loanEnquiryService.setTotalRowCount({ displayRowCount: that.rowData.length, totalRowCount: response['total_records'] })

			}
			else{
				that._loanEnquiryService.setTotalRowCount({ displayRowCount: this.gridOptions.api.getDisplayedRowCount(), totalRowCount: this.gridOptions.api.getDisplayedRowCount() })

			}

		}
	}

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
			fileName: 'loan-inquiry',
			onlySelected: onlySelectedRowData,
			rowHeight: 15,
			headerRowHeight: 20,
			sheetName: 'Sheet1',
			customHeader: [
				[{
					styleId: "excelHeader",
					data: {
						type: "String",
						value: "Loan Inquiry Export"
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
					if (key == 'disbursement' || key == 'fee_accrued' ||
						key == 'fee_balance' || key == 'fee_paid' ||
						key == 'interest_accrued' || key == 'interest_balance' ||
						key == 'interest_paid' || key == 'interest_pct' ||
						key == 'interest_amount' || key == 'other_fees' ||
						key == 'outstanding_account_balance' || key == 'outstanding_loan_balance' ||
						key == 'principal_balance' || key == 'principal_paid' || key == 'repayment'
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
	* Date range search button click event
	* @param type 
	*/
	onSearchButtonClickEvent(dataObj: any) {
		this.gridApi.showLoadingOverlay();
		if (dataObj.type == 'loan-inquiry') {
			this.from_date = dataObj.from_date;
			this.to_date = dataObj.to_date;
			this._message.showLoader(true);
			this.initializeLoanEnquiryData(this.from_date, this.to_date);
		}
	}

	/**
	* On Grid column change event
	* @param event 
	*/
	onGridColumnsChanged(event) {
		const url = (this._apiMapper.endpoints[CyncConstants.GRID_CONFIG_API_URL]).replace('{id}', 'loan_inquery');
		let requestBody = [];
		event.columnApi.getAllDisplayedColumns().forEach((obj, index) => requestBody.push({ 'index': index, col_id: obj.colId }))
		this._loanEnquiryService.saveGridConfig(url, requestBody).subscribe(data => { });
	};

	exportBulkExcel(){
		//this.router.navigate(['/loan-maintenance/loan-activity/bulk-export']);

		window.open('#/loan-maintenance/loan-activity/bulk-export'); 

	}


}
