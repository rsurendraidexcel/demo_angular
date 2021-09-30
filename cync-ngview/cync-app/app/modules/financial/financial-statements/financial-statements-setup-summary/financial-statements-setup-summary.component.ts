import { Component, OnInit, OnDestroy } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { Helper } from '@cyncCommon/utils/helper';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn } from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { FinancialStatementModel, IncomeStatementModel } from '../models/financial-statements.model';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs/Subscription';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import { DatePipe } from '@angular/common';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { Observable } from 'rxjs/Observable';
import { DecimalPipe } from '@angular/common';
import 'jspdf-autotable';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-financial-statements-setup-summary',
	templateUrl: './financial-statements-setup-summary.component.html',
	styleUrls: ['./financial-statements-setup-summary.component.scss']
})
export class FinancialStatementsSetupSummaryComponent implements OnInit, OnDestroy {

	public static YOY_TYPE = 'yoy';
	selectedFinanceType = 'balance-sheet';
	financialStatementAPIResponse: any;
	isFormLoaded = false;
	projectID = '';
	headerText = CyncConstants.HEADER_TEXT;
	selectedRadioBtn = 'finanical_statements';
	projectName = '';
	date: string;
	clientSelectionSubscription: Subscription;
	client_name: string;
	borrowerId: string;
	timeLineList = 0;

	constructor(
		private _helper: Helper,
		private fb: FormBuilder,
		private _router: Router,
		private route: ActivatedRoute,
		private _apiMapper: APIMapper,
		private _message: MessageServices,
		private _financialStatementsService: FinancialStatementsService,
		private _clientSelectionService: ClientSelectionService,
		private _cyncHttpService: CyncHttpService,
		private datePipe: DatePipe,
		private _decimalPipe: DecimalPipe,
		private _radioButtonVisible: RadioButtonService
	) {
		this.borrowerId = CyncConstants.getSelectedClient();
	}

	ngOnInit() {
		this._message.showLoader(true);
		this.initializeFinancialStatemets();
		this.getClientDetails();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(true, this.projectID, this.selectedRadioBtn);
	}

	/**
	 * This method is use to get project details
	 * @param projectID
	 */
	getProjectDetails(projectID) {
		this._financialStatementsService.getProjectDetails(this._apiMapper.endpoints[CyncConstants.GET_PROJECT_DETAILS]
			.replace('{projectId}', projectID)).subscribe(res => {
				this.projectName = res.projectName;
			});
	}

	/**
	 * Initialized financial statement data
	 */
	initializeFinancialStatemets() {
		// Getting project-ID from route URL
		this.route.params.subscribe(params => {
			this.projectID = params['id'];
		});
		this.getProjectDetails(this.projectID);

		/*
		 * Calling API to initialize form data
		 */
		this._financialStatementsService.getFinancialStatementSummary(this._apiMapper.endpoints[CyncConstants.GET_FINANCIAL_SUMMARY_DATA]
			.replace('{projectId}', this.projectID)).subscribe(res => {
				this.financialStatementAPIResponse = res;
				this.timeLineList = res.balancesheet.timeLines.length;

				this.isFormLoaded = true;
				this._message.showLoader(false);
			});
	}

	/**
	 * Financial Type drop down on change event
	 * event
	 */
	onChangeFinanceType(event: any) {
		this.selectedFinanceType = event;
	}

	/**
	 * Edit button click event
	 */
	editButtonClick() {
		this._message.showLoader(true);
		if (this.selectedFinanceType === 'balance-sheet') {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_BALANCE_SHEET_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		} else if (this.selectedFinanceType === 'income-statement') {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_INCOME_STATEMENT_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		} else if (this.selectedFinanceType === 'cash-flow') {
			this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_STATEMENTS_CASH_FLOW_PAGE_REDIRECT_URL]
				.replace('{projectId}', this.projectID));
		}
	}

	/**
	 * Back to summary page
	 */
	backSummaryPage() {
		this._message.showLoader(true);
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_ANALYZER_REDIRECT_URL]);
	}

	/**
	 * Get filter data value according to timeline
	 * timeLineSting is timeline value
	 * data is an array of objects
	 */
	getTimelineValue(timeLineSting: string, data: any, type: string) {
		const resultData = data.filter(obj => obj.timeLine === timeLineSting);
		if (resultData[0].value === null) {
			return 'n.a.';
		} else {
			if (type !== null && type !== undefined && this._helper.compareIgnoreCase(type, FinancialStatementsSetupSummaryComponent.YOY_TYPE)) {
				const formatedValue = this._decimalPipe.transform(resultData[0].value, '.2') + '%';
				// return resultData[0].value + '%';
				return formatedValue;
			} else {
				const formatedValue = this._decimalPipe.transform(resultData[0].value, '.2');
				// return resultData[0].value;
				return formatedValue;
			}
		}
	}

	/**
	 * get Data Timeline CSS color
	 * timeLineSting is timeline value
	 * data is an array of objects
	 */
	getTimelineCSSValue(timeLineSting: string, data: any) {
		const resultData = data.filter(obj => obj.timeLine === timeLineSting);
		if (resultData[0].value === null) {
			return 'black';
		} else if (resultData[0].value < 0) {
			return 'red';
		} else {
			return 'black';
		}
	}

	/**
	 * this method will get call on export
	 */
	exportPdf() {
		this._message.showLoader(true);
		setTimeout(() => {
			if (this.selectedFinanceType === 'balance-sheet') {
				this.exportContentAsPDFFile('balance-table-first', 'Balance-sheet.pdf', 'Balance Sheet -');
			} else if (this.selectedFinanceType === 'income-statement') {
				this.exportContentAsPDFFile('income-content', 'Income-statement.pdf', 'Income Statement -');
			} else if (this.selectedFinanceType === 'cash-flow') {
				this.exportContentAsPDFFile('cashflow-table-first', 'Cash-flow.pdf', 'Cash Flow -');
			}
		}, 100);
	}

	/**
	 * generate pdf
	 */
	exportContentAsPDFFile(id, fileName, headerName) {
		const doc = new jsPDF('l', 'pt', 'A4');
		const res = doc.autoTableHtmlToJson(document.getElementById(id));
		this.date = new Date().toString();
		const client = this.client_name;
		const date = this.datePipe.transform(this.date, 'MM/dd/yyyy');
		const header = function (data) {
			doc.setFontSize(14);
			doc.setTextColor(40);
			doc.setFontStyle('normal');
			doc.line(0, 38, 1000, 38);
			doc.text(10, 30, headerName + client);
			doc.setFontSize(10);
			doc.text(730, 30, 'Date- ' + date);
		};
		const rowFontStyle = function (cell, data) {
			const tdElement = cell.raw;
			if (tdElement !== undefined && tdElement.classList !== undefined) {
				if (tdElement.classList.contains('hrow')) {
					cell.styles.fontStyle = 'bold';
					cell.styles.fillColor = [211, 211, 211];
				}
				if (tdElement.classList.contains('frow')) {
					cell.styles.fontStyle = 'bold';
					cell.styles.fillColor = [169, 169, 169];
				}
			}
		};

		if (this.timeLineList <= 6) {
			doc.autoTable(res.columns, res.data, {
				addPageContent: header,
				pageSplit: true,
				margin: { right: 10, left: 10, top: 50 },
				styles: { fontSize: 8, overflow: 'linebreak' },
				columnStyles: {
					0: { columnWidth: 300 },
					text: { columnWidth: 'auto' }
				},
				createdCell: rowFontStyle,
				// theme: 'grid'
			});
		} else {
			doc.autoTable(res.columns, res.data, {
				addPageContent: header,
				pageSplit: true,
				margin: { right: 10, left: 10, top: 50 },
				styles: { fontSize: 8, overflow: 'linebreak' },
				columnStyles: {
					0: { columnWidth: 100 },
					text: { columnWidth: 'auto' }
				},
				createdCell: rowFontStyle,
				// theme: 'grid'
			});
		}
		doc.save(fileName);
		this._message.showLoader(false);
	}

	/**
	 * This method is used to get client Details
	 */
	getClientDetails() {
		this._message.showLoader(true);
		const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', this.borrowerId);
		this.getBorrowerDetails(url).subscribe(data => {
			if (data !== undefined && data.borrower !== undefined
				&& data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
				this.client_name = data.borrower.client_name;
			}
			this._message.showLoader(false);
		});
	}

	/**
	 * This method is taken care when user will change the client or borrowers
	 */
	registerReloadGridOnClientSelection() {
		const currObj = this;
		this.clientSelectionSubscription = this._clientSelectionService.clientSelected.subscribe(clientId => {
			if (typeof clientId === 'string' && this._helper.compareIgnoreCase(clientId, CyncConstants.SELECT_CLIENT_PLACEHOLDER)) {
				setTimeout(function () {
					window.location.href = '../../';
				}, 2000);
			} else {
				this.navigateToFAList();
			}
		});
	}

	/**
	 * Method to navigate back to FA list
	 */
	navigateToFAList() {
		this._router.navigateByUrl(MenuPaths.LIST_FINANCE_ANALYZER_PATH);
	}

	/**
	 * unsubscribe the observable for client change
	 */
	ngOnDestroy() {
		if (this.clientSelectionSubscription !== undefined) {
			this.clientSelectionSubscription.unsubscribe();
		}
	}

	/**
	 * get the active client
	 */
	public getBorrowerDetails(url: string): Observable<any> {
		return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
	}
}