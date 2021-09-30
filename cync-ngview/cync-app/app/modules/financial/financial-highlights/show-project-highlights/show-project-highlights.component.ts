import { Component, OnInit, OnDestroy } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ActivatedRoute, Router } from '@angular/router';

import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { FinancialHighlightsService } from '../../financial-highlights/service/financial-highlights.service';
import { FinancialRatioService } from '../../financial-ratio/service/financial-ratio.service';

// For getting the Individual Project Details
import { ListProjectService } from '../../financial-analyzer/service/list-project.service';
import { Observable } from 'rxjs/Observable';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import 'jspdf-autotable';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-show-project-highlights',
	templateUrl: './show-project-highlights.component.html',
	styleUrls: ['./show-project-highlights.component.scss']
})
export class ShowProjectHighlightsComponent implements OnInit, OnDestroy {

	projectID = this.getProjectID();
	selectedRadioBtn: string = 'financial_highligths';
	headerText = CyncConstants.HEADER_TEXT;
	projectName = '';
	type = 'bar';
	keyBalanceSheetData: any;
	keyFinancials: any;
	financialRatioTabularAPIResponse: any;
	tabularCategories: any;
	finTimeline: any;
	date: string;
	clientSelectionSubscription: Subscription;
	client_name: string;
	// For data coming from Key Fin/Balancesheet Summary
	timeLines: any;
	tableColspan: number;
	data: any;
	options: any = [];
	lineGraphData: any = [];
	data1: any;
	borrowerId: string;
	timeLines_LineGraph: any;
	numberofColumns: any;
	isFullScreen:any;

	// For PDF generation
	highlightsWidth_old: any;
	highlightsHeight_old: any;
	highlightsContainer: any;
	highlightsContainerId = 'cync_main_contents_wradio-list';

	constructor(private _msgLoader: MessageServices,
		private _cyncHttpService: CyncHttpService,
		private _clientSelectionService: ClientSelectionService,
		private datePipe: DatePipe,
		private _ratioService: FinancialRatioService,
		private _highlightsService: FinancialHighlightsService,
		private _projectService: ListProjectService,
		private _apiMapper: APIMapper,
		private route: ActivatedRoute,
		private _router: Router,
		private _helper: Helper,
		private _radioButtonVisible: RadioButtonService) {
		this.borrowerId = CyncConstants.getSelectedClient();
	}

	ngOnInit() {
		this._msgLoader.showLoader(true);
		this.getHighlightsData();
		this.getProjectNameByID(this.getProjectID());
		this.getTabularData();
		this.getClientDetails();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(true, this.projectID, this.selectedRadioBtn);
	}

	/**
	* This method will get the Project name
	* @param projectID
	*/
	getProjectNameByID(projectID) {
		const url = this._apiMapper.endpoints[CyncConstants.LIST_PROJECT_BY_ID].replace('{id}', projectID);
		this._projectService.getListProjectById(url).subscribe(res => {
			this.projectName = res.projectName;
		});

	}

	/**
	* This method will get the ProjectID From URL
	*/
	getProjectID(): string {
		let projID = '';
		this.route.params.subscribe(params => {
			projID = params['id'];
			this.projectID = params['id'];
		});
		return projID;
	}


	/**
	 * @deprecated
	 * Get Hightlights data from API
	*/
	getHighlightsData() {
		const url = this._apiMapper.endpoints[CyncConstants.FINANCEIAL_HIGHLIGHTS_API].replace('{projectId}', this.projectID);
		this._highlightsService.getHighlightsData(url).subscribe(res => {
			this.keyBalanceSheetData = res.keyBalanceSheetData;
			this.keyFinancials = res.keyFinancials;
			this.timeLines = res.keyFinancials[0].timeLines;
			this.timeLines_LineGraph = this.beginWithZero(res.keyFinancials[0].timeLines, 0);

			for (let i = 0; i < this.keyFinancials.length; i++) {
				this.options[i] = [];
				this.lineGraphData[i] = [];
				this.options[i] = this.generateGraphOptions(this.keyFinancials[i].data);
				this.lineGraphData[i] = this.beginWithZero(this.keyFinancials[i].data, null);
			}
			this.decideGraphColumns();
			this._msgLoader.showLoader(false);
		});

	}

	backGroundColor(graph: string): string {
		let BackgroundColor: string;
		switch (graph) {
			case 'Revenue':
			case 'Net Profit':
			case 'ROE':
				{
					BackgroundColor = '#32ab41';
					break;
				}
			case 'EBIT':
			case 'D/EBITDA':
				{
					BackgroundColor = '#dc5000';
					break;
				}
			default: {
				BackgroundColor = '#2d5aa3';
				break;
			}
		}
		return BackgroundColor;
	}

	/**
	 * Get Tabular Data from API
	 */
	getTabularData() {
		const url = this._apiMapper.endpoints[CyncConstants.FINANCEIAL_RATIO_REPORT_GRAPH].replace(
			'{projectId}', this.projectID).replace('{type}', 'tabular');
		this._ratioService.getServiceGraph(url).subscribe(res => {
			this.financialRatioTabularAPIResponse = res;
			this.tabularCategories = res.categories;
			this.finTimeline = res.timeperiods;
			this.tableColspan = res.timeperiods.length;
			this._msgLoader.showLoader(false);
		});
	}

		/**
	* Expand to full sceren
	*/
	fnExpand() {
		this.isFullScreen = !this.isFullScreen;
	}

	/**
	 * This method will get called when user press the export button
	 */
	generatePdf() {
		this._msgLoader.showLoader(true);
		setTimeout(() => {
			this.generateChartPDF();
		}, 100);
	}

	generateChartPDF() {
		const deferreds = [];
		const pdf = new jsPDF('landscape');
		this.date = new Date().toString();
		pdf.setFontSize(14);
		pdf.text(17, 8, ' Financial Highlights - ' + this.client_name);
		pdf.setFontSize(10);
		pdf.text(250, 8, 'Date-' + this.datePipe.transform(this.date, 'MM/dd/yyyy')); // whatever format you need.
		pdf.line(0, 16, 300, 16);
		let y = 19;
		const x = 15;
		//const id = ['graph_row_1', 'graph_row_2'];
		const id = ['graph_row_1', 'key_financials_table', 'graph_row_2', 'key_balance_table'];
		let divs = document.getElementById('cync_main_contents_tabular').querySelectorAll('.abc-table'), k;
		for (let i = 0; i < 4; i++) {
			const deferred = $.Deferred();
			deferreds.push(deferred.promise());
			this.generateChartCanvas(pdf, x, y, id[i], deferred, i);
		}
		y = 30;
		let pageheight = 190;
		for (let j = 0; j < divs.length; j++) {
			const deferred = $.Deferred();
			deferreds.push(deferred.promise());
			const clientHeights = document.getElementById('table_content' + j).clientHeight;
			const height = clientHeights / 4;
			pageheight = pageheight - height;
			this.generateTabularCanvas(j, pdf, deferred, y, divs.length, pageheight, height);
			y = y + height + 5;
			if (pageheight <= 35) {
				pageheight = 190;
				y = 30;
				y = y + height + 7;
			}
		}
		$.when.apply($, deferreds).then(function () { // executes after adding all images
			pdf.save('Financial-Highlights.pdf');
			this._msgLoader.showLoader(false);
		});
	}

	/**
	* This method will generate pdf of charts
	*/
	generateChartCanvas(pdf: any, x: any, y: any, id:any, deferred:any, i:any) {
		if (document.getElementById(id)) {
			html2canvas(document.getElementById(id)).then(function (canvas) {
				const clientHeights = document.getElementById(id).clientHeight;
				if (i === 1) {
					y = 25;
				}
				if (i === 2) {
					y = 25;
				}
				if (i === 3) {
					y = 25;
				}
				const height = clientHeights / 4.2;
				const img = canvas.toDataURL();
				pdf.addImage(img, 'PNG', x, y, 270, height);
				//if (i === 1 || i > 2) {
					pdf.addPage();
				//}
				deferred.resolve();
			});
		}
	}

	/**
	* This method will generate pdf of tables
	*/
	generateTabularCanvas(i, pdf, deferred, y, length, pageheight, height) {
		if (document.getElementById('table_content' + i)) {
			html2canvas(document.getElementById('table_content' + i)).then(function (canvas) {
				const img = canvas.toDataURL();
				if (pageheight <= 35) {
					pdf.addPage();
					y = 30;
				}
				pdf.addImage(img, 'PNG', 15, y, 270, height);
				deferred.resolve();
			});
		}
	}

	/**
	* get the active client details
	*/
	getClientDetails() {
		this._msgLoader.showLoader(true);
		const url = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BY_ID].replace('{borrower_id}', this.borrowerId);
		this.getBorrowerDetails(url).subscribe(data => {
			if (data !== undefined && data.borrower !== undefined
				&& data.borrower.client_name !== undefined && data.borrower.client_name !== null) {
				this.client_name = data.borrower.client_name;
			}
			this._msgLoader.showLoader(false);
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
	* get the active client
	*/
	public getBorrowerDetails(url: string): Observable<any> {
		return this._ratioService.getBorrowerDetails(url);
		// return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
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
  * Back to summary page
  */
	backSummaryPage() {
		this._msgLoader.showLoader(true);
		this._router.navigateByUrl(this._apiMapper.endpoints[CyncConstants.FINANCIAL_ANALYZER_REDIRECT_URL]);
	}

	/**
	   * This method will create options for each graphs
	   *
	   */
	generateGraphOptions(data: any) {
		let _maxValue = Math.max.apply(Math, data);
		let _average = (data.reduce(function (a, b) { return a + b; }, 0)) / data.length;
		_maxValue = Math.round(_maxValue + _average) + 0.5;
		return {

			responsive: true,
			maintainAspectRatio: false,
			tooltips: { enabled: true },
			plugins: {
				datalabels: {
					backgroundColor: 'RGBA(255,255,255,0)'
				}
			},
			legend: {
				display: false
			},
			scales: {
				xAxes: [
					{

						padding: { left: '10px' },
						ticks: {
							beginAtZero: true

						},
						barPercentage: 1,
						categoryPercentage: 0.5,
						gridLines: {
							drawOnChartArea: false,
							offsetGridLines: true
						}
					}
				],
				yAxes: [{
					ticks: {
						padding: 5,
						beginAtZero: true,
						suggestedMax: _maxValue

					},
					gridLines: {
						drawOnChartArea: false,
						offsetGridLines: true
					}
				}]
			}

		}

	}

	/**
	* This method will display the currency symbol if its required
	* @param name
	*/
	showCurrencyifRequired(name: string): string {
		let need_dollar_symbol = ['Debt', 'Revenue', 'EBITDA', 'EBIT', 'Net Profit'];

		if (need_dollar_symbol.includes(name)) {
			//returning Dollar Symbol. Can be changed once multi currency has been introduced
			return '$';
		}
	}


	/**
	 * This method will decide the number of columns for the graph based on the length of Financial timeline
	 */
	decideGraphColumns() {
		const classBase = 'col-md-';
		const timelineLength = this.timeLines.length;
		let columns = 12;

		if (timelineLength <= 3) {
			columns = 3;
		} else if (timelineLength > 3 && timelineLength < 6) {
			columns = 4;
		} else if (timelineLength >= 6) {
			columns = 6;
		}

		this.numberofColumns = classBase + columns.toString();
	}

	/**
	 * This method will prepend the list with a zero
	 */
	beginWithZero(input, appendVal): any {
		let output = [];
		output[0] = appendVal;
		Object.keys(input).forEach(key => {
			output.push(input[key])
		});
		return output;
	}
}