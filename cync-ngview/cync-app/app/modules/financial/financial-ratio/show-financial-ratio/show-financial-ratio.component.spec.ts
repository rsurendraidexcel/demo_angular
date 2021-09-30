import { DatePipe } from '@angular/common';
import { FinancialGraphRatioReport } from '../model/financial-ratio.model';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import { async, fakeAsync, tick, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { ActivatedRoute, Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Helper } from '@cyncCommon/utils/helper';
import {
	NgForm, FormsModule, ReactiveFormsModule,
	FormBuilder, FormGroup, Validators, FormControl,
	FormArray, ValidatorFn
} from '@angular/forms';
import { AllFinancialRatio, FinancialRatio, FinancialRatioFormula, FinancialRatioOperator } from '../model/financial-ratio.model';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
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
import { routing } from '../financial-ratio.routing';
import { NgModule } from '@angular/core';
import { ShowFinancialRatioComponent } from '@app/modules/financial/financial-ratio/show-financial-ratio/show-financial-ratio.component';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';
import { FinancialRatioSummaryComponent } from '../financial-ratio-summary/financial-ratio-summary.component';
import { FinancialRatioService } from '../service/financial-ratio.service';

describe('ShowFinancialRatioComponent', () => {
	let component: ShowFinancialRatioComponent;
	let fixture: ComponentFixture<ShowFinancialRatioComponent>;
	let listProjectService: ListProjectService;
	let financialRatioService: FinancialRatioService;

	class MockActivatedRoute {
		params: Observable<any> = Observable.of({});
	}

	class MockRouter {
		url = '/financial/financial-ratio/2';
		navigateByUrl(url: string) { return url; }
	}

	class MockClientSelectionID {
		clientSelected: Observable<any> = Observable.of();
	}

	const mockByIdUrl = 'financial/financial-ratio/743ff13c-6e2b-11e8-b323-0e870a136f0c/view';


	const projectDetails: any = {
		'balanceSheetYear': 0,
		'clientId': 0,
		'clientName': 'string',
		'description': 'string',
		'financialPeriod': 'YEARLY',
		'financialTimeline': 0,
		'folder': { 'folderName': 'string', 'id': 'string' },
		'id': 'string', 'industry': 'string', 'projectName': 'string'
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
			declarations: [FinancialRatioSummaryComponent, ShowFinancialRatioComponent],
			providers: [
				APIMapper,
				Helper,
				DatePipe,
				MessageServices,
				APIMessagesService,
				CommonAPIs,
				ListProjectService,
				FormBuilder,
				FinancialRatioService,
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
		fixture = TestBed.createComponent(ShowFinancialRatioComponent);
		component = fixture.componentInstance;
		listProjectService = TestBed.get(ListProjectService);
		financialRatioService = TestBed.get(FinancialRatioService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show the ratio view page when route param id is present', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, projectDetails);
		fixture.detectChanges();
	});

	it('Should call register Reload Grid On Client Selection', inject([ClientSelectionService],
		(clientSelectionService: ClientSelectionService) => {
			clientSelectionService.clientSelected = Observable.of('Client');
			spyOn(component, 'registerReloadGridOnClientSelection').and.callThrough();
			component.registerReloadGridOnClientSelection();
			expect(component.registerReloadGridOnClientSelection).toHaveBeenCalled();
		}));

	it('should call the initView method with graph as a parameter', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, projectDetails);
		fixture.detectChanges();
		spyOn(component, 'initView').and.callThrough();
		component.initView('graph');
		expect(component.initView).toHaveBeenCalled();
	});

	it('should call the initView method with tabular as a parameter', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, projectDetails);
		fixture.detectChanges();
		spyOn(component, 'initView').and.callThrough();
		component.initView('tabular');
		expect(component.initView).toHaveBeenCalled();
	});

	/*  it('should call the createDataset method', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
		  return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
		  return Observable.of(projectDetails);
		});
		let serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy,projectDetails);
		fixture.detectChanges();
		spyOn(component, 'createDataset').and.callThrough();
		component.createDataset(projectDetails);
		expect(component.createDataset).toHaveBeenCalled();
	  })*/

	it('should call the backGroundColor method', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, projectDetails);
		fixture.detectChanges();
		spyOn(component, 'backGroundColor').and.callThrough();
		component.backGroundColor('graph');
		expect(component.backGroundColor).toHaveBeenCalled();
	});

	it('should call the exportPdf method with typeOfView = tabular ', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, projectDetails);
		fixture.detectChanges();
		component.typeOfView = 'tabular';
		fixture.detectChanges();
		spyOn(component, 'exportPdf').and.callThrough();
		component.exportPdf();
		expect(component.exportPdf).toHaveBeenCalled();
	});

	it('should call the exportPdf method typeOfView = graph', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		const serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy, projectDetails);
		fixture.detectChanges();
		component.typeOfView = 'graph';
		fixture.detectChanges();
		spyOn(component, 'exportPdf').and.callThrough();
		component.exportPdf();
		expect(component.exportPdf).toHaveBeenCalled();
	});
	/*   it('should call the backToSetup method', () => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
		  return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getServiceGraph').and.callFake((url) => {
		  return Observable.of(projectDetails);
		});
		let serviceSpy = spyOn(financialRatioService, 'getBorrowerDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(serviceSpy,projectDetails);
		fixture.detectChanges();
		spyOn(component, 'backToSetup').and.callThrough();
		component.backToSetup();
		expect(component.backToSetup).toHaveBeenCalled();
	  }) */

});
