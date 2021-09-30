import { ShowProjectHighlightsComponent } from './show-project-highlights.component';
import { FinancialHighlightsService } from '../../financial-highlights/service/financial-highlights.service';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import { DatePipe } from '@angular/common';
import { async, fakeAsync, tick, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute, Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import {
	NgForm, FormsModule, ReactiveFormsModule,
	FormBuilder, FormGroup, Validators, FormControl,
	FormArray, ValidatorFn
} from '@angular/forms';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { FinancialRatioService } from '../../financial-ratio/service/financial-ratio.service';
import { ListProject } from '../../financial-analyzer/model/list-project.model';
import { ListProjectService } from '../../financial-analyzer/service/list-project.service';
import { Subscription } from 'rxjs/Subscription';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { RadioButtonModule } from 'primeng/primeng';
import { ChartModule } from 'angular2-chartjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { MessageService } from 'primeng/components/common/messageservice';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';
import { routing } from '../financial-highlights.routing';
import { NgModule } from '@angular/core';
import { ShowFinancialRatioComponent } from '@app/modules/financial/financial-ratio/show-financial-ratio/show-financial-ratio.component';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

describe('ShowProjectHighlightsComponent', () => {
	let component: ShowProjectHighlightsComponent;
	let fixture: ComponentFixture<ShowProjectHighlightsComponent>;
	let financialHighlightsService: FinancialHighlightsService;
	let financialRatioService: FinancialRatioService;
	let listProjectService: ListProjectService;

	class MockActivatedRoute {
		params: Observable<any> = Observable.of({});
	}

	class MockRouter {
		url = '/financial/financial-highlights/2';
		navigateByUrl(url: string) { return url; }
	}

	class MockClientSelectionID {
		clientSelected: Observable<any> = Observable.of();
	}

	const mockByIdUrl = 'financial/financial-highlights/743ff13c-6e2b-11e8-b323-0e870a136f0c/view';


	const keyFinancialData: any = {
		'keyFinancials': [
			{
				'heading': 'D/D+E',
				'timeLines': [
					'2017-Q4',
					'2018-Q1',
					'2018-Q2',
					'2018-Q3',
					'2018-Q4'
				],
				'data': [
					1,
					1,
					1,
					1,
					1
				],
				'yoys': [
					null,
					0,
					0,
					0,
					0
				],
				'financeHighlightGraphType': 'NONE',
				'type': 'TABLE',
				'lastValue': 1,
				'lastYoy': 0
			},
		],
		'keyBalanceSheetData': [
			{
				'heading': 'Total Assets',
				'timeLines': [
					'2017-Q4',
					'2018-Q1',
					'2018-Q2',
					'2018-Q3',
					'2018-Q4'
				],
				'data': [
					11,
					11,
					12,
					123,
					1231
				],
				'yoys': [
					null,
					0,
					9.09,
					925,
					900.81
				]
			},
		]
	};


	const ratiosData: any = {
		'timeperiods': [
			'2017-Q4',
			'2018-Q1',
			'2018-Q2',
			'2018-Q3',
			'2018-Q4',
			'Benchmark Value'
		],
		'categories': [
			{
				'name': 'Liquidity Ratios',
				'datasets': [
					{
						'label': 'Quick Ratio',
						'backgroundColor': 'rgba(57,113,164)',
						'data': [
							1,
							1,
							1,
							1,
							1
						],
						'tabularView': [
							{
								'result': 1,
								'color': 'red'
							},
							{
								'result': 1,
								'color': 'red'
							},
							{
								'result': 1,
								'color': 'red'
							},
							{
								'result': 1,
								'color': 'red'
							},
							{
								'result': 1,
								'color': 'red'
							},
							{
								'result': 2,
								'color': ''
							}
						]
					},

				],
				'symbol': null
			},
		]
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule,
				FormsModule,
				ReactiveFormsModule,
				HttpClientModule,
				RadioButtonModule,
				routing,
				ChartModule
			],
			declarations: [ShowProjectHighlightsComponent, ShowFinancialRatioComponent],
			providers: [
				APIMapper,
				Helper,
				DatePipe,
				MessageServices,
				APIMessagesService,
				CommonAPIs,
				ListProjectService,
				RadioButtonService,
				FormBuilder,
				FinancialRatioService,
				FinancialHighlightsService,
				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
				{ provide: Router, useClass: MockRouter },
				{ provide: ClientSelectionService, useClass: MockClientSelectionID },
				{ provide: MessageService, deps: [] },
				{ provide: MatDialog, deps: [Overlay] },
				{ provide: CyncHttpService, deps: [] },
				{ provide: CustomHttpService, deps: [HttpClient] },
				{ provide: HttpInterceptor, deps: [HttpClient] }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ShowProjectHighlightsComponent);
		component = fixture.componentInstance;
		listProjectService = TestBed.get(ListProjectService);
		financialRatioService = TestBed.get(FinancialRatioService);
		financialHighlightsService = TestBed.get(FinancialHighlightsService);
	});


	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show the highlights view page when route param id is present', () => {
		spyOn(financialHighlightsService, 'getHighlightsData').and.callFake((url) => {
			return Observable.of(keyFinancialData);
		});
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(keyFinancialData);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(ratiosData);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, ratiosData);
		fixture.detectChanges();
	});

	it('Should call register Reload Grid On Client Selection', inject(
		[ClientSelectionService],
		(clientSelectionService: ClientSelectionService) => {
			clientSelectionService.clientSelected = Observable.of('Client');
			spyOn(component, 'registerReloadGridOnClientSelection').and.callThrough();
			component.registerReloadGridOnClientSelection();
			expect(component.registerReloadGridOnClientSelection).toHaveBeenCalled();
		}));

	it('should call the generatePdf method', () => {
		spyOn(financialHighlightsService, 'getHighlightsData').and.callFake((url) => {
			return Observable.of(keyFinancialData);
		});
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(keyFinancialData);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(ratiosData);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, ratiosData);
		fixture.detectChanges();
		spyOn(component, 'generatePdf').and.callThrough();
		component.generatePdf();
		expect(component.generatePdf).toHaveBeenCalled();
	});


	it('should call the backSummaryPage method', () => {
		spyOn(financialHighlightsService, 'getHighlightsData').and.callFake((url) => {
			return Observable.of(keyFinancialData);
		});
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(keyFinancialData);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(ratiosData);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, ratiosData);
		fixture.detectChanges();
		spyOn(component, 'backSummaryPage').and.callThrough();
		component.backSummaryPage();
		expect(component.backSummaryPage).toHaveBeenCalled();
	});
});
