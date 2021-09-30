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
import { FinancialHighlightsService } from '../../financial-highlights/service/financial-highlights.service';


let financialHighlightsService: FinancialHighlightsService;
let cyncHttpService: CyncHttpService;

const allHighlightsData = [{
	'name': 'Liquidity Ratios',
	'id': '743ff13c-6e2b-11e8-b323-0e870a136f0c',
	'formulas': [{
		'name': 'Quick Ratio', 'active': true, 'operators': [{ 'display': '=', 'value': '=', 'active': true, 'selected': false },
		{ 'display': '>', 'value': '>', 'active': true, 'selected': true }]
	}]
}];

const mockByIdUrl = 'financial/financial-highlights/743ff13c-6e2b-11e8-b323-0e870a136f0c';

describe('FinancialHighlightsService', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [FinancialHighlightsService,
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
		financialHighlightsService = TestBed.get(FinancialHighlightsService);
		cyncHttpService = TestBed.get(CyncHttpService);
	});

	it('should get all financial Highlights Data', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, allHighlightsData);
		financialHighlightsService.getHighlightsData(mockByIdUrl).subscribe(Response => {
			expect(JSON.stringify(Response)).toBe(JSON.stringify(allHighlightsData));
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

});