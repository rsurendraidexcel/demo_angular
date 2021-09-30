import { async, fakeAsync, tick, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { CyncConstants } from '@cyncCommon/utils/constants';
import { ActivatedRoute, Router, RoutesRecognized, NavigationStart, NavigationEnd } from '@angular/router';

import { NgForm, FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
import { FormValidationService } from '@cyncCommon/cync-form-validator/form-validation.service';
import { FormValidationComponent } from '@cyncCommon/cync-form-validator/form-validation.component';
import { FinancialStatementModel, ParameterDataModel, TimelineValuesModel } from '../models/financial-statements.model';
import { Subscription } from 'rxjs/Subscription';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CustomHttpService } from '@cyncCommon/services/http.service';
import { HttpInterceptor } from '@cyncCommon/services/http.intercepter';

import { Helper } from '@cyncCommon/utils/helper';
import { FileUpload } from 'primeng/primeng';
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { FinancialStatementsService } from '../services/financial-statements.service';
import { MessageServices } from '@cyncCommon/component/message/message.component';
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { By } from '@angular/platform-browser';
import { MenuPaths } from '@cyncCommon/utils/menu-path';
import { ClientSelectionService } from '@cyncCommon/services/client-selection.service';
import { FinancialStatementsSetupSummaryComponent } from './financial-statements-setup-summary.component';

import { MessageService } from 'primeng/components/common/messageservice';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';

import 'rxjs/add/operator/filter';
import { RadioButtonModule } from 'primeng/primeng';

import { DatePipe } from '@angular/common';
import { AppConfig } from '@app/app.config';
import { CookieService } from 'ngx-cookie-service';
import { jsPDF } from "jspdf";
import  html2canvas  from 'html2canvas';
import { DecimalPipe } from '@angular/common';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';


describe('FinancialStatementsSetupSummaryComponent', () => {
	let component: FinancialStatementsSetupSummaryComponent;
	let fixture: ComponentFixture<FinancialStatementsSetupSummaryComponent>;
	let financialStatementsService: FinancialStatementsService;
	let cyncHttpService: CyncHttpService;
	let commonService: CommonAPIs;
	let debugElement: DebugElement;

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

	const financeProjectStatus: any = {
		'enableFinanceStatementComplete': false,
		'enableFinanceRatioComplete': false
	};

	const projectDetails: any = {
		'id': '8d5367cf-a41a-4d5a-8e5e-d6e80812f296',
		'projectName': 'Test Project for test case',
		'description': 'Test Project for test case',
		'clientName': '0000001 CLIENTASSIGNMENTCOPY Q',
		'clientId': 4164,
		'industry': '18018, Description8',
		'balanceSheetYear': 2018,
		'financialPeriod': 'YEARLY',
		'financialTimeline': 2,
		'folder': null
	};

	const financeStmtResponse: any = {
		'balancesheet': {
			'timeLines': [
				'2016',
				'2017',
				'2018'
			],
			'assets': {
				'nonCurrentData': [
					{
						'paramName': 'Inventory, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Property, plant and equipment, net',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Long-term investments and receivables, net',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Accounts receivable, net, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Investments in and advance to affiliates, subsidiaries, associates, and joint ventures',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Other long-term investments and receivables',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Goodwill',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Intangible assets, net (excluding goodwill)',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Derivative instruments and hedges, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Deferred tax assets, net, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Deposits assets, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Assets of disposal group, including discontinued operation, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Other assets, noncurrent',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					}
				],
				'totalNonCurrent': {
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				'currentData': [
					{
						'paramName': 'Cash, cash equivalents, and short-term investments',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 600.0
							},
							{
								'timeLine': '2017',
								'value': 700.0
							},
							{
								'timeLine': '2018',
								'value': 800.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': 16.67
							},
							{
								'timeLine': '2018',
								'value': 14.29
							}
						]
					},
					{
						'paramName': 'Receivables, net, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Inventory, net',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Prepaid expense, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Deferred costs, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Assets held-for-sale, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Deferred tax assets, net, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Derivative instruments and hedges, assets',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Income taxes receivable, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Assets of disposal group, including discontinued operation, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Deposits assets, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					{
						'paramName': 'Other assets, current',
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					}
				],
				'totalCurrent': {
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 600.0
						},
						{
							'timeLine': '2017',
							'value': 700.0
						},
						{
							'timeLine': '2018',
							'value': 800.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': 16.67
						},
						{
							'timeLine': '2018',
							'value': 14.29
						}
					]
				},
				'total': {
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 600.0
						},
						{
							'timeLine': '2017',
							'value': 700.0
						},
						{
							'timeLine': '2018',
							'value': 800.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': 16.67
						},
						{
							'timeLine': '2018',
							'value': 14.29
						}
					]
				}
			},
			'equityAndLiabilities': {
				'liabilities': {
					'nonCurrentData': [
						{
							'paramName': 'Long-term debt and capital lease obligations',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Accounts payable and accrued liabilities, noncurrent',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Accrued income taxes, noncurrent',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Deferred tax liabilities, noncurrent',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Other liabilities, noncurrent',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						}
					],
					'totalNonCurrent': {
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					'currentData': [
						{
							'paramName': 'Accounts payable, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Accrued liabilities, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Employee-related liabilities, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Taxes payable, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Interest and dividends payable, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Debt, Current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Deferred tax liabilities, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Liabilities of disposal group, including discontinued operation, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Other liabilities, current',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						}
					],
					'totalCurrent': {
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					},
					'total': {
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 0.0
							},
							{
								'timeLine': '2017',
								'value': 0.0
							},
							{
								'timeLine': '2018',
								'value': 0.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': null
							},
							{
								'timeLine': '2018',
								'value': null
							}
						]
					}
				},
				'equity': {
					'equityData': [
						{
							'paramName': 'Stockholders’ equity attributable to parent',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Preferred & common stock (issued minus unissued)',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Additional paid in capital',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Treasury stock, value',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Accumulated other comprehensive income (loss), net of tax',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Retained earnings (accumulated deficit)',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Other stockholders’ equity, including portion attributable to noncontrolling interest',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						},
						{
							'paramName': 'Stockholders’ equity attributable to noncontrolling interest',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 600.0
								},
								{
									'timeLine': '2017',
									'value': 700.0
								},
								{
									'timeLine': '2018',
									'value': 800.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': 16.67
								},
								{
									'timeLine': '2018',
									'value': 14.29
								}
							]
						},
						{
							'paramName': 'Stockholders’ equity, including portion attributable to noncontrolling interest',
							'paramValues': [
								{
									'timeLine': '2016',
									'value': 0.0
								},
								{
									'timeLine': '2017',
									'value': 0.0
								},
								{
									'timeLine': '2018',
									'value': 0.0
								}
							],
							'yoys': [
								{
									'timeLine': '2016',
									'value': null
								},
								{
									'timeLine': '2017',
									'value': null
								},
								{
									'timeLine': '2018',
									'value': null
								}
							]
						}
					],
					'totalEquity': {
						'paramValues': [
							{
								'timeLine': '2016',
								'value': 600.0
							},
							{
								'timeLine': '2017',
								'value': 700.0
							},
							{
								'timeLine': '2018',
								'value': 800.0
							}
						],
						'yoys': [
							{
								'timeLine': '2016',
								'value': null
							},
							{
								'timeLine': '2017',
								'value': 16.67
							},
							{
								'timeLine': '2018',
								'value': 14.29
							}
						]
					}
				},
				'total': {
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 600.0
						},
						{
							'timeLine': '2017',
							'value': 700.0
						},
						{
							'timeLine': '2018',
							'value': 800.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': 16.67
						},
						{
							'timeLine': '2018',
							'value': 14.29
						}
					]
				}
			}
		},
		'incomeStatement': {
			'timeLines': [
				'2016',
				'2017',
				'2018'
			],
			'grossProfitParams': [
				{
					'paramName': 'Revenue',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 100.0
						},
						{
							'timeLine': '2017',
							'value': 200.0
						},
						{
							'timeLine': '2018',
							'value': 200.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': 100.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					]
				},
				{
					'paramName': 'Cost of Sales',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'grossProfit': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 100.0
					},
					{
						'timeLine': '2017',
						'value': 200.0
					},
					{
						'timeLine': '2018',
						'value': 200.0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 100.0
					},
					{
						'timeLine': '2018',
						'value': 0.0
					}
				]
			},
			'opProfitParams': [
				{
					'paramName': 'Operating costs and expenses',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': -70.0
						},
						{
							'timeLine': '2017',
							'value': -22.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': -68.57
						},
						{
							'timeLine': '2018',
							'value': -100.0
						}
					]
				},
				{
					'paramName': 'Selling and marketing expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'General and administrative expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Provision for doubtful accounts',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Other general expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Depreciation Expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Other operating income',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'opProfit': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 170.0
					},
					{
						'timeLine': '2017',
						'value': 222.0
					},
					{
						'timeLine': '2018',
						'value': 200.0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 30.59
					},
					{
						'timeLine': '2018',
						'value': -9.91
					}
				]
			},
			'profitBeforeTaxParams': [
				{
					'paramName': 'Interest Expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Nonoperating income',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Nonoperating expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Gain (loss) on sale of property plant equipment',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Income (loss) from equity method investments',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'profitBeforeTax': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 170.0
					},
					{
						'timeLine': '2017',
						'value': 222.0
					},
					{
						'timeLine': '2018',
						'value': 200.0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 30.59
					},
					{
						'timeLine': '2018',
						'value': -9.91
					}
				]
			},
			'incomeLossContParams': [
				{
					'paramName': 'Income tax expense (benefit)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'incomeLossCont': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 170.0
					},
					{
						'timeLine': '2017',
						'value': 222.0
					},
					{
						'timeLine': '2018',
						'value': 200.0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 30.59
					},
					{
						'timeLine': '2018',
						'value': -9.91
					}
				]
			},
			'compIncomeParams': [
				{
					'paramName': 'Income (loss) from discontinued operations, net of tax, including portion attributable to noncontrolling interest',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Extraordinary item, gain (loss), net of tax, including portion attributable to noncontrolling interest',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Net income (loss) attributable to noncontrolling interest',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Other comprehensive income (loss), net of tax, portion attributable to parent',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0.0
						},
						{
							'timeLine': '2017',
							'value': 0.0
						},
						{
							'timeLine': '2018',
							'value': 0.0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'compIncomeLoss': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 170.0
					},
					{
						'timeLine': '2017',
						'value': 222.0
					},
					{
						'timeLine': '2018',
						'value': 200.0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 30.59
					},
					{
						'timeLine': '2018',
						'value': -9.91
					}
				]
			},
			'totalIncome': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 170.0
					},
					{
						'timeLine': '2017',
						'value': 222.0
					},
					{
						'timeLine': '2018',
						'value': 200.0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 30.59
					},
					{
						'timeLine': '2018',
						'value': -9.91
					}
				]
			}
		},
		'cashFlow': {
			'timeLines': [
				'2016',
				'2017',
				'2018'
			],
			'cashProvidedByOpActParams': [
				{
					'paramName': 'Net Income',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 500
						},
						{
							'timeLine': '2017',
							'value': 500
						},
						{
							'timeLine': '2018',
							'value': 500
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					]
				},
				{
					'paramName': 'Depreciation',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Amortization',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Gain)/loss on sale of property plant equipment',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Income)/loss from equity method investments',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Non-operating expenses',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Non-operating Income)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Interest Expense',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'changesInWorkingCapitalParams': [
				{
					'paramName': '(Increase)/decrease in accounts receivable',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Increase)/decrease in inventories',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Increase)/decrease in Other assets',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Increase/(decrease) in trade accounts payable',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Increase/(decrease)Accrued expenses',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Increse/(decrease) in Employee related liabilities',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Increse/(decrease) in taxes payable',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Other current liabilities Increase/(Decrease)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Income tax paid)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'cashProvidedByOperatingActivitiesTotal': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 500
					},
					{
						'timeLine': '2017',
						'value': 500
					},
					{
						'timeLine': '2018',
						'value': 500
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				]
			},
			'cashUsedForInvestActParams': [
				{
					'paramName': '(Capital expenditure)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Proceeds from sale of facility',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Increase)/decrease in Investments',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Acquisitions) and dispositions of business, net of cash acquired',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Insurance proceeds received for damage to equipment',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Net (Purchase)/sale of other investments',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'cashUsedForInvestingActivitiesTotal': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 0
					},
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': null
					},
					{
						'timeLine': '2018',
						'value': null
					}
				]
			},
			'cashUsedForFinActParams': [
				{
					'paramName': 'Deferreed tax liabilities',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Principal payments under finance lease obligation)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Proceeds from issuance of long term debt',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Proceeds from issuance of common stock',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Proceeds/(buyback) from Preferential stock',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': '(Interest Expense)',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Increase/(decrease) in retained earnings',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				},
				{
					'paramName': 'Increase/(decrease) in other liabilities, non current',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'cashUsedForFinancingActivitiesTotal': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 0
					},
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': null
					},
					{
						'timeLine': '2018',
						'value': null
					}
				]
			},
			'incrOrDecrInCashAndCashEquiParams': [
				{
					'paramName': 'Effect of exchange rate on cash',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'incrOrDecrInCashAndCashEquivalentsTotal': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 500
					},
					{
						'timeLine': '2017',
						'value': 500
					},
					{
						'timeLine': '2018',
						'value': 500
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				]
			},
			'cashAndCashEquiAtYearEndParams': [
				{
					'paramName': 'Cash and Cash Equivalents at Beginning of Year',
					'paramValues': [
						{
							'timeLine': '2016',
							'value': 0
						},
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'yoys': [
						{
							'timeLine': '2016',
							'value': null
						},
						{
							'timeLine': '2017',
							'value': null
						},
						{
							'timeLine': '2018',
							'value': null
						}
					]
				}
			],
			'cashAndCashEquiAtYearEndTotal': {
				'paramValues': [
					{
						'timeLine': '2016',
						'value': 500
					},
					{
						'timeLine': '2017',
						'value': 500
					},
					{
						'timeLine': '2018',
						'value': 500
					}
				],
				'yoys': [
					{
						'timeLine': '2016',
						'value': null
					},
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				]
			}
		}
	};

	const dataObject: any = [
		{
			'timeLine': '2016',
			'value': -100
		},
		{
			'timeLine': '2017',
			'value': 100
		},
		{
			'timeLine': '2018',
			'value': null
		}
	];
	const borrowerDetails: any = {
		'borrower': {
			'id': 4164,
			'client_name': '0000001 CLIENTASSIGNMENTCOPY Q',
			'short_name': 'jStBEdB',
			'client_number': 'JW2L2G3',
			'bbc_frequency': 'M',
			'active': false,
			'email_id': 'shweta.b@idexcel.com',
			'description': '',
			'processing_type': 'ABL',
			'original_amount': '0.0',
			'limit_amount': '0.0',
			'client_url': '',
			'account_reference': '',
			'activation_start_dt': null,
			'activation_end_dt': '2017-11-07',
			'loan_dt': null,
			'latest_snapshot_id': null,
			'currency_id': null,
			'naics_code_id': 1,
			'parent_client_id': null,
			'bbc_frequency_date': '2017-11-07',
			'bbc_period': '',
			'bbc_day': '',
			'tax_id': '',
			'country_id': '102',
			'state_province_id': '185',
			'company_type': '',
			'term': '',
			'branch': '',
			'sales_region_id': null,
			'minimum_balance_amount': '0.0',
			'ucc_number': null,
			'ucc_filling_date': null,
			'cash_controls': '',
			'risk_rating_code': '',
			'state_name': 'Alabama',
			'country_name': 'United States',
			'sales_region_name': null,
			'currency_name': '',
			'naics_code_name': '18018, Description8',
			'mail_addresses_attributes': [
				{
					'id': 148,
					'address_code': 'PRABHAKARHOME',
					'name_primary': 'Prabhakar',
					'name_alternate': 'prabhakar.pateti@gmail.com',
					'city': 'Bangalore',
					'zip_code': '560016',
					'street_address': 'ForumMall Opp funn fun, Bangalore',
					'phones_attributes': [
						{
							'id': 520,
							'phone_no': '9945342875',
							'phone_type': 'Cell'
						},
						{
							'id': 522,
							'phone_no': '9900387046',
							'phone_type': 'Direct'
						}
					],
					'country_id': 102,
					'country_name': 'United States',
					'state_province_id': 188,
					'state_name': 'California'
				},
				{
					'id': 150,
					'address_code': 'PATETIHOME',
					'name_primary': 'Rao',
					'name_alternate': 'Pateti',
					'city': 'Bangalore',
					'zip_code': '560056',
					'street_address': 'MARTUR',
					'phones_attributes': [
						{
							'id': 528,
							'phone_no': '9945342876',
							'phone_type': 'Cell'
						},
						{
							'id': 529,
							'phone_no': '9945342877',
							'phone_type': 'Direct'
						}
					],
					'country_id': 102,
					'country_name': 'United States',
					'state_province_id': 188,
					'state_name': 'California'
				}
			],
			'contacts_attributes': [
				{
					'id': 121,
					'title': 'Mr.',
					'name': 'Prabhakar',
					'primary_email_id': 'prabhakar.p@idexcel.com',
					'alternate_email_id': 'prabhakar.pateti@gmail.com',
					'mail_address_id': 148,
					'notes': 'ForumMall',
					'phones_attributes': [
						{
							'id': 521,
							'phone_no': '9945342875',
							'phone_type': 'Cell'
						},
						{
							'id': 523,
							'phone_no': '9900387046',
							'phone_type': 'Direct'
						}
					]
				}
			],
			'miscellaneous_attributes': [
				{
					'id': 4029,
					'borrower_bank_name': '',
					'borrower_bank_routing': null,
					'borrower_bank_account': null,
					'borrower_remit_line1': null,
					'borrower_remit_line2': null,
					'borrower_remit_line3': null,
					'borrower_remit_line4': null
				}
			],
			'assign_managers': [
				{
					'manager_id': 31,
					'manager_name': 'pmstaging'
				},
				{
					'manager_id': 132,
					'manager_name': 'pmshweta'
				}
			],
			'custom_fields_attributes': [

			]
		}
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule,
				FormsModule,
				ReactiveFormsModule,
				HttpClientModule,
				RadioButtonModule
			],
			declarations: [FinancialStatementsSetupSummaryComponent],
			providers: [
				APIMapper,
				CyncHttpService,
				Helper,
				MessageServices,
				APIMessagesService,
				FinancialStatementsService,
				CommonAPIs,
				RadioButtonService,
				DecimalPipe,
				DatePipe,
				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
				{ provide: Router, useClass: MockRouter },
				{ provide: ClientSelectionService, useClass: MockClientSelectionID },
				{ provide: MessageService, deps: [] },
				{ provide: MatDialog, deps: [Overlay] },
				{ provide: CustomHttpService, deps: [HttpClient] },
				{ provide: HttpInterceptor, deps: [HttpClient] },
				{ provide: AppConfig, deps: [] },
				{ provide: CookieService, deps: [] }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinancialStatementsSetupSummaryComponent);
		component = fixture.componentInstance;
		debugElement = fixture.debugElement;
		financialStatementsService = TestBed.get(FinancialStatementsService);
		commonService = TestBed.get(CommonAPIs);
		cyncHttpService = TestBed.get(CyncHttpService);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('Should create financial statement summary component', () => {

		const getPeojectDetailsSpy = spyOn(financialStatementsService, 'getProjectDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectDetailsSpy, projectDetails);

		const getFinanceStmtSummarySpy = spyOn(financialStatementsService, 'getFinancialStatementSummary');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getFinanceStmtSummarySpy, financeStmtResponse);

		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'get');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, borrowerDetails);

		fixture.detectChanges();
		expect(getPeojectDetailsSpy).toHaveBeenCalled();
		expect(getFinanceStmtSummarySpy).toHaveBeenCalled();
		expect(cyncHttpServiceSpy).toHaveBeenCalled();
	});

	it('Should call edit button click and redirect to balance sheet page', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		component.selectedFinanceType = 'balance-sheet';
		spyOn(component, 'editButtonClick').and.callThrough();
		component.editButtonClick();
		expect(component.editButtonClick).toHaveBeenCalled();
	}));

	it('Should call edit button click and redirect to income statement page', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		component.selectedFinanceType = 'income-statement';
		spyOn(component, 'editButtonClick').and.callThrough();
		component.editButtonClick();
		expect(component.editButtonClick).toHaveBeenCalled();
	}));

	it('Should call edit button click and redirect to cash flow statement page', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		component.selectedFinanceType = 'cash-flow';
		spyOn(component, 'editButtonClick').and.callThrough();
		component.editButtonClick();
		expect(component.editButtonClick).toHaveBeenCalled();
	}));

	it('Should call back to summary page event while click on back to summay page', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		spyOn(component, 'backSummaryPage').and.callThrough();
		component.backSummaryPage();
		expect(component.backSummaryPage).toHaveBeenCalled();
	}));

	it('Should call navigate to FA List', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		spyOn(component, 'navigateToFAList').and.callThrough();
		component.navigateToFAList();
		expect(component.navigateToFAList).toHaveBeenCalled();
	}));

	it('Should call register Reload Grid On Client Selection', inject([ClientSelectionService],
		(clientSelectionService: ClientSelectionService) => {
			clientSelectionService.clientSelected = Observable.of('Client');
			spyOn(component, 'registerReloadGridOnClientSelection').and.callThrough();
			component.registerReloadGridOnClientSelection();
			expect(component.registerReloadGridOnClientSelection).toHaveBeenCalled();
		}));

	it('should trigger on change Finance Type using dropdown change', () => {
		spyOn(component, 'onChangeFinanceType').and.callThrough();
		component.onChangeFinanceType('income-statement');
		expect(component.onChangeFinanceType).toHaveBeenCalled();

	});

	it('should trigger getTimelineCSSValue method', () => {
		spyOn(component, 'getTimelineCSSValue').and.callThrough();
		component.getTimelineCSSValue('2016', dataObject);
		expect(component.getTimelineCSSValue).toHaveBeenCalled();

	});

	it('Should call export pdf for balance sheet', () => {
		const getPeojectDetailsSpy = spyOn(financialStatementsService, 'getProjectDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectDetailsSpy, projectDetails);

		const getFinanceStmtSummarySpy = spyOn(financialStatementsService, 'getFinancialStatementSummary');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getFinanceStmtSummarySpy, financeStmtResponse);

		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'get');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, borrowerDetails);

		fixture.detectChanges();
		component.selectedFinanceType = 'balance-sheet';
		fixture.detectChanges();
		spyOn(component, 'exportPdf').and.callThrough();
		component.exportPdf();
		expect(component.exportPdf).toHaveBeenCalled();
	});

	it('Should call export pdf for income statement', () => {
		const getPeojectDetailsSpy = spyOn(financialStatementsService, 'getProjectDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectDetailsSpy, projectDetails);

		const getFinanceStmtSummarySpy = spyOn(financialStatementsService, 'getFinancialStatementSummary');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getFinanceStmtSummarySpy, financeStmtResponse);

		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'get');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, borrowerDetails);

		fixture.detectChanges();
		component.selectedFinanceType = 'income-statement';
		fixture.detectChanges();
		spyOn(component, 'exportPdf').and.callThrough();
		component.exportPdf();
		expect(component.exportPdf).toHaveBeenCalled();
	});

	it('Should call export pdf for cash flow statement', () => {
		const getPeojectDetailsSpy = spyOn(financialStatementsService, 'getProjectDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectDetailsSpy, projectDetails);

		const getFinanceStmtSummarySpy = spyOn(financialStatementsService, 'getFinancialStatementSummary');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getFinanceStmtSummarySpy, financeStmtResponse);

		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'get');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, borrowerDetails);

		fixture.detectChanges();
		component.selectedFinanceType = 'cash-flow';
		fixture.detectChanges();
		spyOn(component, 'exportPdf').and.callThrough();
		component.exportPdf();
		expect(component.exportPdf).toHaveBeenCalled();
	});
});
