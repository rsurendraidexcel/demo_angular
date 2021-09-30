import { Component, OnInit, OnDestroy } from '@angular/core';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { FinancialRatioService } from '../service/financial-ratio.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Subscription } from 'rxjs/Subscription';

// For getting the Individual Project Details
import { ListProject } from '../../financial-analyzer/model/list-project.model';
import { ListProjectService } from '../../financial-analyzer/service/list-project.service';

import { FinancialGraphRatioReport } from '../model/financial-ratio.model';
import { Observable } from 'rxjs/Observable';
import { jsPDF } from 'jspdf';
import  html2canvas from 'html2canvas';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { Helper } from '@cyncCommon/utils/helper';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

@Component({
	selector: 'app-show-financial-ratio',
	templateUrl: './show-financial-ratio.component.html',
	styleUrls: ['./show-financial-ratio.component.scss']
})
export class ShowFinancialRatioComponent implements OnInit, OnDestroy {

	typeOfView = 'tabular';
	type = '';
	data: any = [];
	options: any = [];
	projectID = this.getProjectID();
	selectedRadioBtn = 'financial_ratio';
	isFinanceRatioPermitted = true;
	projectName = '';
	financialRatioAPIResponse: any;
	financialRatioTabularAPIResponse: any;
	finTimeline: any;
	finTableTimeline: any;
	timeLineList:any;

	tabularCategories: any;
	graphCategories: any;

	graphData: any;
	renderTabularView = true;
	renderGraphView = false;

	date: string;
	clientSelectionSubscription: Subscription;
	client_name: string;
	borrowerId: string;
	dynamicColumn = 0;


	constructor(private _msgLoader: MessageServices,
		private _clientSelectionService: ClientSelectionService,
		private _cyncHttpService: CyncHttpService,
		private _ratioService: FinancialRatioService,
		private datePipe: DatePipe,
		private _projectService: ListProjectService,
		private _apiMapper: APIMapper,
		private route: ActivatedRoute,
		private _router: Router,
		private _helper: Helper,
		private _radioButtonVisible: RadioButtonService) {
		this.borrowerId = CyncConstants.getSelectedClient();
	}

	ngOnInit() {
		this.getProjectNameByID(this.getProjectID());
		this._msgLoader.showLoader(true);
		this.getTabularData();
		this.getClientDetails();
		this.registerReloadGridOnClientSelection();
		this._radioButtonVisible.setRadioButton(true, this.projectID, this.selectedRadioBtn);
	}

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
	* This method will initialize the Tabular/Graph View
	*/
	initView(type: string) {

		switch (type) {
			case 'graph': {
				this._msgLoader.showLoader(true);
				this.getGraphData();
				break;
			}
			default: {
				this._msgLoader.showLoader(true);
				this.getTabularData();
				break;
			}

		}

	}


	/**
	 * This method will get the data from API
	 */

	getGraphData() {
		const url = this._apiMapper.endpoints[CyncConstants.FINANCEIAL_RATIO_REPORT_GRAPH].replace(
			'{projectId}', this.projectID).replace('{type}', 'graph');
		this._ratioService.getServiceGraph(url).subscribe(res => {
			this.financialRatioAPIResponse = res;
			this.graphData = res.categories;
			this.graphCategories = res.categories;
			this.finTimeline = res.timeperiods;
			this.renderGraph();
			this.decideGraphColumns();
			this._msgLoader.showLoader(false);
		});
		//  this.financialRatioAPIResponse = this._ratioService.getServiceGraph(url);
		// this.graphData= this.financialRatioAPIResponse.categories

	}

	getTabularData() {
		const url = this._apiMapper.endpoints[CyncConstants.FINANCEIAL_RATIO_REPORT_GRAPH].replace(
			'{projectId}', this.projectID).replace('{type}', 'tabular');
		this._ratioService.getServiceGraph(url).subscribe(res => {
			this.financialRatioTabularAPIResponse = res;
			this.tabularCategories = res.categories;
			this.finTableTimeline = res.timeperiods;
			this.timeLineList = res.timeperiods.length;
			this._msgLoader.showLoader(false);
		});
		//  this.financialRatioAPIResponse = this._ratioService.getServiceGraph(url);
		// this.graphData= this.financialRatioAPIResponse.categories

	}

	/**
	* This method will render the Graphs
	*/
	renderGraph() {

		this.type = 'bar';
		for (let i = 0; i < this.graphCategories.length; i++) {

			this.options[i] = [];

			for (let j = 0; j < this.graphCategories[i].datasets.length; j++) {
				this.options[i][j] = this.generateGraphOptions(this.graphCategories[i].datasets[j].data);
			}
		}
		this.renderGraphView = true;
	}


	backToSetup() {
		this._router.navigate(['/financial/financial-ratio/' + this.projectID]);
	}

	/**
	* This method will call the respective method to export pdf
	*/
	exportPdf() {
		this._msgLoader.showLoader(true);
		setTimeout(() => {
			if (this.typeOfView === 'tabular') {
				this.genTabularPDF();
			} else if (this.typeOfView === 'graph') {
				this.genChartPDF();
			}
		}, 100);
	}

	/**
	* This method will generate charts pdf
	*/
	genChartPDF() {
		const deferreds = [];
		const pdf = new jsPDF('landscape');
		this.date = new Date().toString();
		pdf.setFontSize(14);
		pdf.text(17, 8, ' Financial Ratios - ' + this.client_name);
		pdf.setFontSize(10);
		pdf.text(250, 8, 'Date-' + this.datePipe.transform(this.date, 'MM/dd/yyyy')); // whatever format you need.
		pdf.line(0, 12, 300, 12);
		let y = 14;
		let pageheight = 190;
		let flag = false;
		let divs = document.getElementById('cync_main_contents_chart').querySelectorAll('.chart_graph_row'), k;
		for (let i = 0; i < divs.length; i++) {
			const deferred = $.Deferred();
			deferreds.push(deferred.promise());
			const clientHeights = document.getElementById('chart_content' + i).clientHeight;
			const height = clientHeights / 4.4;
			pageheight = pageheight - height;
			this.generateChartCanvas(i, pdf, deferred, y, divs.length, pageheight, height, flag);
			y = y + height + 3;
			if (height > pageheight) {
				flag = true;
				pageheight = 190;
				// pageheight = pageheight - height;
				y = 14;
				// y = y + height + 7;
			} else {
				flag = false;
			}
		}
		const _this = this;
		$.when.apply($, deferreds).then(function () { // executes after adding all images
			pdf.save('Financial-Ratios-Charts.pdf');
			_this._msgLoader.showLoader(false);
		});
	}

	/**
	* This method will generate images of charts
	*/
	generateChartCanvas(elid: any, pdf: any, deferred: any, y:any, length:any, pageheight:any, height:any, flag: boolean) {
		html2canvas(document.getElementById('chart_content' + elid)).then(function (canvas) {

			const img = canvas.toDataURL();
			if (flag === true) {
				pdf.addPage();
				y = 14;
			}
			pdf.addImage(img, 'PNG', 15, y, 270, height);
			deferred.resolve();
		});
	}

	/**
	* This method will generate tabular pdf
	*/
	genTabularPDF() {
		const deferreds = [];
		const doc = new jsPDF('landscape', 'mm', 'a4');
		this.date = new Date().toString();
		doc.setFontSize(14);
		doc.text(17, 8, ' Financial Ratios - ' + this.client_name);
		doc.setFontSize(10);
		doc.text(250, 8, 'Date-' + this.datePipe.transform(this.date, 'MM/dd/yyyy')); // whatever format you need.
		doc.line(0, 25, 300, 25);
		let y = 30;
		let pageheight = 190;
		let divs = document.getElementById('cync_main_contents_tabular').querySelectorAll('.abc-table'), j;
		for (let i = 0; i < divs.length; i++) {
			const deferred = $.Deferred();
			deferreds.push(deferred.promise());
			const clientHeights = document.getElementById('table_content' + i).clientHeight;
			const height = clientHeights / 4;
			pageheight = pageheight - height;
			this.generateTabularCanvas(i, doc, deferred, y, divs.length, pageheight, height);
			y = y + height + 5;
			if (pageheight <= 35) {
				pageheight = 190;
				y = 30;
				y = y + height + 7;
			}
		}
		const _this = this;
		$.when.apply($, deferreds).then(function () { // executes after adding all images
			doc.save('Financial-Ratios-Tables.pdf');
			_this._msgLoader.showLoader(false);
		});
	}

	/**
	* This method will generate images of tables
	*/
	generateTabularCanvas(i, doc, deferred, y, length, pageheight, height) {
		html2canvas(document.getElementById('table_content' + i)).then(function (canvas) {
			const img = canvas.toDataURL();
			if (pageheight <= 35) {
				doc.addPage();
				y = 30;
			}
			doc.addImage(img, 'PNG', 15, y, 270, height);
			deferred.resolve();
		});
	}

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
	 * Set the background color of Graph
	 * @param graph
	 */
	backGroundColor(graph: string): string {
		let BackgroundColor: string;
		switch (graph) {
			case 'Liquidity Ratios': {
				BackgroundColor = '#32669b';
				break;
			}
			case 'Leverage Ratios': {
				BackgroundColor = '#dc5000';
				break;
			}
			case 'Activity Ratios': {
				BackgroundColor = '#0eaedb';
				break;
			}
			case 'Growth Ratios': {
				BackgroundColor = '#32ab41';
				break;
			}

			case 'Profitability Ratios': {
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
	 * This method will create options for each graphs
	 *
	 */
	generateGraphOptions(data: any) {
		let _maxValue = Math.max.apply(Math, data);
		const _average = (data.reduce(function (a, b) { return a + b; }, 0)) / data.length;
		_maxValue = Math.round(_maxValue + _average);


		return {

			responsive: true,
			maintainAspectRatio: false,
			tooltips: { enabled: false },
			plugins: {
				datalabels: {
					backgroundColor: 'RGBA(255,255,255,0)'
				}
			},
			legend: {
				display: false
			},
			scales: {
				xAxes: [{
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
						beginAtZero: true,
						suggestedMax: _maxValue

					},
					gridLines: {
						drawOnChartArea: false,
						offsetGridLines: true
					}
				}]
			}

		};

	}

	/**
   * Make the Graph columns dynamically based on the Fin timeline length
   */

	decideGraphColumns() {

		const timelineLength = this.finTimeline.length;

		if (timelineLength <= 3) {
			this.dynamicColumn = 3;
		} else if (timelineLength > 3 && timelineLength < 6) {
			this.dynamicColumn = 3;
		} else if (timelineLength >= 6 && timelineLength <= 7) {
			this.dynamicColumn = 4;
		} else if (timelineLength > 7) {
			this.dynamicColumn = 6;
		}
	}


}
