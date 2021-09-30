import { async, fakeAsync, tick, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FinancialRatioSummaryComponent } from './financial-ratio-summary.component';
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
import { FinancialRatioService } from '../service/financial-ratio.service';
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
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

describe('FinancialRatioSummaryComponent', () => {
	let component: FinancialRatioSummaryComponent;
	let fixture: ComponentFixture<FinancialRatioSummaryComponent>;
	let financialRatioService: FinancialRatioService;
	let listProjectService: ListProjectService;

	class MockActivatedRoute {
		params: Observable<any> = Observable.of({});
	}

	class MockRouter {
		url = '/financial/financial-ratio';
		navigateByUrl(url: string) { return url; }
	}

	class MockClientSelectionID {
		clientSelected: Observable<any> = Observable.of();
	}

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

	const ratioDetail = [{
		'name': 'Liquidity Ratios',
		'id': '743ff13c-6e2b-11e8-b323-0e870a136f0c',
		'formulas': [{
			'name': 'Quick Ratio', 'active': true, 'operators': [{ 'display': '=', 'value': '=', 'active': true, 'selected': false },
			{ 'display': '>', 'value': '>', 'active': true, 'selected': true }]
		}]
	}];

	const event = {
		target: {
			'scrollHeight': 200,
			'scrollTop': 100,
			'clientHeight': 100
		},
		filteredValue: 'abc'
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
				MessageServices,
				APIMessagesService,
				FinancialRatioService,
				CommonAPIs,
				ListProjectService,
				RadioButtonService,
				FormBuilder,
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
		fixture = TestBed.createComponent(FinancialRatioSummaryComponent);
		component = fixture.componentInstance;
		financialRatioService = TestBed.get(FinancialRatioService);
		listProjectService = TestBed.get(ListProjectService);
		// debugElement = fixture.debugElement;
		// commonService = TestBed.get(CommonAPIs);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should show the ratio edit page when route param id is present', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		activatedRoute.params = Observable.of({ id: 2 });
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getAllFinancialRatio').and.callFake((url) => {
			return Observable.of(ratioDetail);
		});
		fixture.detectChanges();
	})
	);

	it('should call initializeOperatorFields method', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		spyOn(component, 'initializeOperatorFields').and.callThrough();
		component.initializeOperatorFields();
		expect(component.initializeOperatorFields).toHaveBeenCalled();
	}));

	it('should save the ratio details when save button is clicked',
		inject([Router], (router: Router) => {
			spyOn(component, 'saveRatio').and.callThrough();
			const saveSpy = spyOn(financialRatioService, 'createAllFinancialRatio');
			ServiceSpy.spyCompServiceAndReturnDataForMock(saveSpy, { status: 201 });
			component.saveRatio(projectDetails);
			expect(component.saveRatio).toHaveBeenCalled();
		}));

	// it('should update the edited ratio details when save button is clicked',
	// 	inject([Router], (router: Router) => {
	// 		spyOn(component, 'updateFinancialRato').and.callThrough();
	// 		const updateSpy = spyOn(financialRatioService, 'updateFinancialRato');
	// 		ServiceSpy.spyCompServiceAndReturnDataForMock(updateSpy, { status: 200 });
	// 		component.updateFinancialRato(projectDetails);
	// 		expect(component.updateFinancialRato).toHaveBeenCalled();
	// 	}));

	it('Should call register Reload Grid On Client Selection', inject([
		ClientSelectionService],
		(clientSelectionService: ClientSelectionService) => {
			clientSelectionService.clientSelected = Observable.of('Client');
			spyOn(component, 'registerReloadGridOnClientSelection').and.callThrough();
			component.registerReloadGridOnClientSelection();
			expect(component.registerReloadGridOnClientSelection).toHaveBeenCalled();
		}));

	it('should call onKey method', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getAllFinancialRatio').and.callFake((url) => {
			return Observable.of(ratioDetail);
		});
		component.createForm();
		fixture.detectChanges();
		spyOn(component, 'onKey').and.callThrough();
		component.onKey(event, 0, 0, true);
		expect(component.onKey).toHaveBeenCalled();
	}));

	it('should call fnClick method', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getAllFinancialRatio').and.callFake((url) => {
			return Observable.of(ratioDetail);
		});
		component.createForm();
		fixture.detectChanges();
		spyOn(component, 'fnClick').and.callThrough();
		component.fnClick(event, 0, 0);
		expect(component.fnClick).toHaveBeenCalled();
	}));

	it('should call onChange method', inject([ActivatedRoute], (activatedRoute: ActivatedRoute) => {
		spyOn(listProjectService, 'getListProjectById').and.callFake((url) => {
			return Observable.of(projectDetails);
		});
		spyOn(financialRatioService, 'getAllFinancialRatio').and.callFake((url) => {
			return Observable.of(ratioDetail);
		});
		component.createForm();
		fixture.detectChanges();
		spyOn(component, 'onChange').and.callThrough();
		component.onChange(event, true, 1, 0, 0, true);
		expect(component.onChange).toHaveBeenCalled();
	}));


});
