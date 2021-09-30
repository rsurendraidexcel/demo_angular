import { TestBed, inject, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Helper } from '@cyncCommon/utils/helper';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AppConfig } from '@app/app.config';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';
import { Injectable } from '@angular/core';
import { AllFinancialRatio, FinancialRatio, FinancialGraphRatioReport, FinancialRatioFormula } from '../model/financial-ratio.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { FinancialRatioService } from '../service/financial-ratio.service';

let financialRatioService: FinancialRatioService;
let cyncHttpService: CyncHttpService;

const allFinancialRatio = [{
	'name': 'Liquidity Ratios',
	'id': '743ff13c-6e2b-11e8-b323-0e870a136f0c',
	'formulas': [{
		'name': 'Quick Ratio', 'active': true, 'operators': [{ 'display': '=', 'value': '=', 'active': true, 'selected': false },
		{ 'display': '>', 'value': '>', 'active': true, 'selected': true }]
	}]
}];

const mockByIdUrl = 'financial/financial-ratio/743ff13c-6e2b-11e8-b323-0e870a136f0c';

describe('FinancialRatioService', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [FinancialRatioService,
				CyncHttpService,
				Helper,
				APIMapper,
				{ provide: AppConfig, deps: [] },
				{ provide: HttpInterceptor, deps: [] },
				{ provide: MatDialog, deps: [Overlay] },
				{ provide: APIMessagesService, deps: [] },
				{ provide: CookieService, deps: [] }],
			imports: [HttpClientModule, RouterTestingModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		financialRatioService = TestBed.get(FinancialRatioService);
		cyncHttpService = TestBed.get(CyncHttpService);
	});

	it('should get all Financial Ratio details', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, allFinancialRatio);
		financialRatioService.getAllFinancialRatio(mockByIdUrl).subscribe(Response => {
			expect(JSON.stringify(Response)).toBe(JSON.stringify(allFinancialRatio));
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should save the Ratios', () => {
		const mockChargeCodeSaveUrl = 'financial/financial-ratio/743ff13c-6e2b-11e8-b323-0e870a136f0c';
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'postService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, {});
		const updateRequestBody = new FinancialRatio();
		updateRequestBody.id = 2;
		financialRatioService.createAllFinancialRatio(mockChargeCodeSaveUrl, updateRequestBody)
			.subscribe(chargeCodesResponse => {
				expect(cyncHttpServiceSpy.calls.count()).toBe(1);
			});
	});

	it('should get Financial Ratio by Id', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, allFinancialRatio);
		financialRatioService.getFinancialRatoById(mockByIdUrl).subscribe(Response => {
			expect(JSON.stringify(Response)).toBe(JSON.stringify(allFinancialRatio));
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should update the Ratios', () => {
		const mockChargeCodeSaveUrl = 'financial/financial-ratio/743ff13c-6e2b-11e8-b323-0e870a136f0c';
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'putService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, {});
		const updateRequestBody = new AllFinancialRatio();
		financialRatioService.updateFinancialRato(mockChargeCodeSaveUrl, updateRequestBody)
			.subscribe(chargeCodesResponse => {
				expect(cyncHttpServiceSpy.calls.count()).toBe(1);
			});
	});

	it('should get Financial Ratio summary graph', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, allFinancialRatio);
		financialRatioService.getServiceGraph(mockByIdUrl).subscribe(Response => {
			expect(JSON.stringify(Response)).toBe(JSON.stringify(allFinancialRatio));
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

});