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
import { FinancialStatementModel, CashFlowModel, CashFlowParamsModel, CashFlowDataModel } from '../models/financial-statements.model';
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
import { FinancialStatementsSetupCashflowComponent } from './financial-statements-setup-cashflow.component';

import { MessageService } from 'primeng/components/common/messageservice';
import { MatDialog } from '@angular/material';
import { Overlay } from '@angular/cdk/overlay';
import { APIMessagesService } from '@cyncCommon/component/api-messages/api-messages.service';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';
import { RadioButtonService } from '@cyncCommon/component/common-radio-header/common-radio-header.component.service';

import 'rxjs/add/operator/filter';
import { RadioButtonModule } from 'primeng/primeng';

describe('FinancialStatementsSetupCashflowComponent', () => {
	let component: FinancialStatementsSetupCashflowComponent;
	let fixture: ComponentFixture<FinancialStatementsSetupCashflowComponent>;
	let financialStatementsService: FinancialStatementsService;
	let commonService: CommonAPIs;
	let debugElement: DebugElement;
	let helperService: Helper;
	const formBuilder: FormBuilder = new FormBuilder();
	const dummyFormGroup = formBuilder.group({
		'parameter': new FormControl('', Validators.compose([Validators.required])),
		'data': formBuilder.group({
			'timeLine': new FormControl(),
			'value': new FormControl()
		}),
		'customParameter': new FormControl(),
		'id': new FormControl(),
		'newcustomfield': new FormControl({ value: false, disabled: true }, Validators.compose([])),
		'uniqueId': new FormControl()
	});

	const control = new FormControl('test');
	const nullControlValue = new FormControl(null);
	class MockActivatedRoute {
		params: Observable<any> = Observable.of({});
	}

	class MockRouter {
		url = '/financial/financial-ratio';
		public re = new RoutesRecognized(2, '/financial/financial-statement/123', '/financial/financial-statement/123', null);
		public events = new Observable(observer => {
			observer.next(this.re);
			observer.complete();
		});
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

	const newProjectDetails: any = {
		'id': null,
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
	const cashFlowData: any = {
		'cashProvidedByOpActParams': [
			{
				'parameter': 'Net Income',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c679810-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_NET_INCOME',
				'customParameter': false
			},
			{
				'parameter': 'newnew',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': 'd9e26d4e-1416-47f7-a561-b3f88a131f6a',
				'uniqueId': 'NEWNEW_GCXodUHzztQOdBPGIwpBzxAwDXGLib',
				'customParameter': true
			},
			{
				'parameter': 'newnew',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': 'd9e26d4e-1416-47f7-a561-b3f88a131f6b',
				'uniqueId': 'NEWNEW_GCXodUHzztQOdBPGIwpBzxAwDXGLic',
				'customParameter': true
			},
			{
				'parameter': 'new',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '628342b5-a5e8-45a6-98ec-e096b858a394',
				'uniqueId': 'NEW_ForFSIijJxYPHzFLuwFbCEMSCbqEbv',
				'customParameter': true
			},
			{
				'parameter': 'Depreciation',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c681996-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_DEPRECIATION',
				'customParameter': false
			},
			{
				'parameter': 'Amortization',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c68abd0-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_AMORTIZATION',
				'customParameter': false
			},
			{
				'parameter': '(Gain)/loss on sale of property plant equipment',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6926af-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_GAIN_LOSS_SALE_PROPERTY_PLANT_EQUIPMENT',
				'customParameter': false
			},
			{
				'parameter': '(Income)/loss from equity method investments',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c69c7b9-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_INCOME_LOSS_FROM_EQUITY_METHOD_INVESTMENTS',
				'customParameter': false
			},
			{
				'parameter': 'Non-operating expenses',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6a70e0-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_NON_OPERATING_EXPENSES',
				'customParameter': false
			},
			{
				'parameter': '(Non-operating Income)',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6aea6c-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_NON_OPERATING_INCOME',
				'customParameter': false
			},
			{
				'parameter': 'Interest Expense',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6b6d66-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'OPERATING_ACTIVITIES_INTEREST_EXPENSE',
				'customParameter': false
			}
		],
		'changesInWorkingCapitalParams': [
			{
				'parameter': '(Increase)/decrease in accounts receivable',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6c569d-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_ACCOUNTS_RECEIVABLE',
				'customParameter': false
			},
			{
				'parameter': '(Increase)/decrease in inventories',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6cdfcc-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_INVENTORIES',
				'customParameter': false
			},
			{
				'parameter': '(Increase)/decrease in Other assets',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6d800b-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_OTHER_ASSETS',
				'customParameter': false
			},
			{
				'parameter': 'Increase/(decrease) in trade accounts payable',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6e4f92-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_TRADE_ACCOUNTS_PAYABLE',
				'customParameter': false
			},
			{
				'parameter': 'Increase/(decrease)Accrued expenses',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6eebd0-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_ACCRUED_EXPENSES',
				'customParameter': false
			},
			{
				'parameter': 'Increse/(decrease) in Employee related liabilities',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c6fa83b-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCRESE_DECREASE_IN_EMPLOYEE_RELATED_LIABILITIES',
				'customParameter': false
			},
			{
				'parameter': 'Increse/(decrease) in taxes payable',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c704670-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCRESE_DECREASE_IN_TAXES_PAYABLE',
				'customParameter': false
			},
			{
				'parameter': 'Other current liabilities Increase/(Decrease)',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c70f7a3-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'OTHER_CURRENT_LIABILITIES_INCREASE_DECREASE',
				'customParameter': false
			},
			{
				'parameter': '(Income tax paid)',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c7189c4-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCOME_TAX_PAID',
				'customParameter': false
			}
		],
		'cashProvidedByOperatingActivitiesTotal': [
			{
				'timeLine': '2017',
				'value': 0
			},
			{
				'timeLine': '2018',
				'value': 0
			}
		],
		'cashUsedForInvestActParams': [
			{
				'parameter': '(Capital expenditure)',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c5e3410-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_FLOW_CAPITAL_EXPENDITURE',
				'customParameter': false
			},
			{
				'parameter': 'Proceeds from sale of facility',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c5f0693-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'PROCEEDS_FROM_SALE_OF_FACILITY',
				'customParameter': false
			},
			{
				'parameter': '(Increase)/decrease in Investments',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c5f90e0-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_INVESTMENTS',
				'customParameter': false
			},
			{
				'parameter': '(Acquisitions) and dispositions of business, net of cash acquired',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c601220-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'ACQUISITIONS_AND_DISPOSITIONS_OF_BUSINESS_NET_CASH_ACQUIRED',
				'customParameter': false
			},
			{
				'parameter': 'Insurance proceeds received for damage to equipment',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c608b60-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INSURANCE_PROCEEDS_RECEIVED_FOR_DAMAGE_TO_EQUIPMENT',
				'customParameter': false
			},
			{
				'parameter': 'Net (Purchase)/sale of other investments',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c610ed1-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'NET_PURCHASE_SALE_OF_OTHER_INVESTMENTS',
				'customParameter': false
			}
		],
		'cashUsedForInvestingActivitiesTotal': [
			{
				'timeLine': '2017',
				'value': 0
			},
			{
				'timeLine': '2018',
				'value': 0
			}
		],
		'cashUsedForFinActParams': [
			{
				'parameter': 'Deferreed tax liabilities',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c61a138-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'DEFERREED_TAX_LIABILITIES',
				'customParameter': false
			},
			{
				'parameter': '(Principal payments under finance lease obligation)',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c622940-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'PRINCIPAL_PAYMENTS_UNDER_FINANCE_LEASE_OBLIGATION',
				'customParameter': false
			},
			{
				'parameter': 'Proceeds from issuance of long term debt',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c62d7c4-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'PROCEEDS_FROM_ISSUANCE_OF_LONG_TERM_DEBT',
				'customParameter': false
			},
			{
				'parameter': 'Proceeds from issuance of common stock',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c636a77-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'PROCEEDS_FROM_ISSUANCE_OF_COMMON_STOCK',
				'customParameter': false
			},
			{
				'parameter': 'Proceeds/(buyback) from Preferential stock',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c63e2a3-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'PROCEEDS_BUYBACK_FROM_PREFERENTIAL_STOCK',
				'customParameter': false
			},
			{
				'parameter': '(Interest Expense)',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c64693d-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'FINANCING_ACTIVITIES_INTEREST_EXPENSE',
				'customParameter': false
			},
			{
				'parameter': 'Increase/(decrease) in retained earnings',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c64f321-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_RETAINED_EARNINGS',
				'customParameter': false
			},
			{
				'parameter': 'Increase/(decrease) in other liabilities, non current',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c658237-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'INCREASE_DECREASE_IN_OTHER_LIABILITIES_NON_CURRENT',
				'customParameter': false
			}
		],
		'cashUsedForFinancingActivitiesTotal': [
			{
				'timeLine': '2017',
				'value': 0
			},
			{
				'timeLine': '2018',
				'value': 0
			}
		],
		'incrOrDecrInCashAndCashEquiParams': [
			{
				'parameter': 'Effect of exchange rate on cash',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c663337-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'EFFECT_OF_EXCHANGE_RATE_ON_CASH',
				'customParameter': false
			}
		],
		'incrOrDecrInCashAndCashEquivalentsTotal': [
			{
				'timeLine': '2017',
				'value': 0
			},
			{
				'timeLine': '2018',
				'value': 0
			}
		],
		'cashAndCashEquiAtYearEndParams': [
			{
				'parameter': 'Cash and Cash Equivalents at Beginning of Year',
				'data': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'id': '0c671a9f-abac-11e8-b6f2-0e141bdeec76',
				'uniqueId': 'CASH_AND_CASH_EQUIVALENTS_AT_BEGINNING_OF_YEAR',
				'customParameter': false
			}
		],
		'cashAndCashEquiAtYearEndTotal': [
			{
				'timeLine': '2017',
				'value': 0
			},
			{
				'timeLine': '2018',
				'value': 0
			}
		]
	};

	const financeStatementData = {
		'id': '2f4a0823-99c1-4732-a126-9ff5d2670116',
		'projectId': 'd353cdec-84fd-475a-86ce-343da0ed4510',
		'timeLinesList': [
			'2017',
			'2018'
		],
		'balanceSheetData': {
			'assets': {
				'nonCurrentData': [
					{
						'parameter': 'testtt',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '90eaa0e4-c778-4d4f-9bfa-29335dc451a3',
						'uniqueId': 'TESTTT_peCoknYQshuDHGnnMsGiiPBQaIcnHp',
						'customParameter': true
					},
					{
						'parameter': 'tes',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '4ae02067-8bba-4fe8-9be2-16a69833b8d2',
						'uniqueId': 'SANJ_DMHRwCEmqSTaYjoqJrdhENHTeJTXMc',
						'customParameter': true
					},
					{
						'parameter': 'Inventory, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3308d8-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'INVENTORY_NONCURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Property, plant and equipment, net',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c33ebc1-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'PROPERTY_PLANT_AND_EQUIPMENT_NET',
						'customParameter': false
					},
					{
						'parameter': 'Long-term investments and receivables, net',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c34b4ec-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'LONG_TERM_INVESTMENTS_AND_RECEIVABLES_NET',
						'customParameter': false
					},
					{
						'parameter': 'Accounts receivable, net, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c35474b-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'ACCOUNTS_RECEIVABLE_NET_NONCURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Investments in and advance to affiliates, subsidiaries, associates, and joint ventures',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c36368b-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'INVESTMENTS_ADVANCE_TO_AFFILIATES_SUBSIDIARIES_ASSOCIATES_AND_JOINT_VENTURES',
						'customParameter': false
					},
					{
						'parameter': 'Other long-term investments and receivables',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c36bdbd-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'OTHER_LONG_TERM_INVESTMENTS_AND_RECEIVABLES',
						'customParameter': false
					},
					{
						'parameter': 'Goodwill',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c375f89-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'GOOD_WILL',
						'customParameter': false
					},
					{
						'parameter': 'Intangible assets, net (excluding goodwill)',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c38532e-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'INTANGIBLE_ASSETS_NET_EXCLUDING_GOODWILL',
						'customParameter': false
					},
					{
						'parameter': 'Derivative instruments and hedges, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c38d91e-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DERIVATIVE_INSTRUMENTS_AND_HEDGES_NONCURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Deferred tax assets, net, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c397663-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DEFERRED_TAX_ASSETS_NET_NONCURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Deposits assets, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3a461c-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DEPOSITS_ASSETS_NONCURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Assets of disposal group, including discontinued operation, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3b2ad9-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'ASSETS_DISPOSAL_GROUP_INCLUDING_DISCONTINUED_OPERATION_NONCURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Other assets, noncurrent',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3bbcc2-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'OTHER_ASSETS_NONCURRENT',
						'customParameter': false
					}
				],
				'totalNonCurrent': [
					{
						'timeLine': '2017',
						'value': 0
					},
					{
						'timeLine': '2018',
						'value': 0
					}
				],
				'currentData': [
					{
						'parameter': 'testabc',
						'data': [
							{
								'timeLine': '2017',
								'value': 100
							},
							{
								'timeLine': '2018',
								'value': 100
							}
						],
						'id': 'fbb0e1bf-d91e-405c-98fc-ea680f78784b',
						'uniqueId': 'TESTABC_cgdZSiVIZDoBBAibQeagaJygwVxvRJ',
						'customParameter': true
					},
					{
						'parameter': 'Investments in and advance to affiliates, subsidiaries, associates',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '06ca6c87-b657-40d6-89d5-f08fdd68ea71',
						'uniqueId': 'INVESTMENTS_IN_AND_ADVANCE_TO_AFFILIATES_SUBSIDIARIES_ASSOCIATES_AND_JOINT_VENTURES',
						'customParameter': true
					},
					{
						'parameter': 'qqqwertyui',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '1e3f0a9c-8764-41f2-8bb3-7a30b31d292b',
						'uniqueId': 'FDAFDA_OwTpatwzMzVrxdijqQdkcVrXqMeSLI',
						'customParameter': true
					},
					{
						'parameter': 'test',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '95e8fb04-4096-40ee-899e-ef7ca6c0217a',
						'uniqueId': 'ABC_uxLwussbuRFOcMQkBygZYXgABQhDBa',
						'customParameter': true
					},
					{
						'parameter': 'Cash, cash equivalents, and short-term investments',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3c4298-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'CASH_EQUIVALENTS_AND_SHORT_TERM_INVESTMENTS',
						'customParameter': false
					},
					{
						'parameter': 'Receivables, net, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3d29af-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'RECEIVABLES_NET_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Inventory, net',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3db375-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'INVENTORY_NET',
						'customParameter': false
					},
					{
						'parameter': 'Prepaid expense, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3e57e6-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'PREPAID_EXPENSE_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Deferred costs, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3eeae8-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DEFERRED_COSTS_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Assets held-for-sale, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c3f855d-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'ASSETS_HELD_FOR_SALE_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Deferred tax assets, net, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c400968-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DEFERRED_TAX_ASSETS_NET_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Derivative instruments and hedges, assets',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c410068-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DERIVATIVE_INSTRUMENTS_AND_HEDGES_ASSETS',
						'customParameter': false
					},
					{
						'parameter': 'Income taxes receivable, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c41764d-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'INCOME_TAXES_RECEIVABLE_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Assets of disposal group, including discontinued operation, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c41fe26-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'ASSETS_OF_DISPOSAL_GROUP_INCLUDING_DISCONTINUED_OPERATION_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Deposits assets, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c42aea3-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'DEPOSITS_ASSETS_CURRENT',
						'customParameter': false
					},
					{
						'parameter': 'Other assets, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						],
						'id': '0c4374db-abac-11e8-b6f2-0e141bdeec76',
						'uniqueId': 'OTHER_ASSETS_CURRENT',
						'customParameter': false
					}
				],
				'totalCurrent': [
					{
						'timeLine': '2017',
						'value': 100
					},
					{
						'timeLine': '2018',
						'value': 100
					}
				],
				'total': [
					{
						'timeLine': '2017',
						'value': 100
					},
					{
						'timeLine': '2018',
						'value': 100
					}
				]
			},
			'equityAndLiabilities': {
				'liabilities': {
					'nonCurrentData': [
						{
							'parameter': 'Long-term debt and capital lease obligations',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c43f97e-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'LONG_TERM_DEBT_AND_CAPITAL_LEASE_OBLIGATIONS',
							'customParameter': false
						},
						{
							'parameter': 'Accounts payable and accrued liabilities, noncurrent',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c44c9d3-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'ACCOUNTS_PAYABLE_AND_ACCRUED_LIABILITIES_NONCURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Accrued income taxes, noncurrent',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c458e9c-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'ACCRUED_INCOME_TAXES_NONCURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Deferred tax liabilities, noncurrent',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c460918-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'DEFERRED_TAX_LIABILITIES_NONCURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Other liabilities, noncurrent',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c46d559-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'OTHER_LIABILITIES_NONCURRENT',
							'customParameter': false
						}
					],
					'totalNonCurrent': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'currentData': [
						{
							'parameter': 'testtb',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '309d6cfe-9551-480b-b7cf-49c088e23dc8',
							'uniqueId': 'TESTTB_vouQHytWjxtDeyHNcMVOgtOUqSEHMM',
							'customParameter': true
						},
						{
							'parameter': 'abc',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': 'bcf801bf-8006-47d6-b06b-dbd4b3fe287d',
							'uniqueId': 'ABC_rHOHvHcKGTSZDHEwzPqYXypjWMvbrQ',
							'customParameter': true
						},
						{
							'parameter': '  fdafda',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': 'c0bccee9-1179-40e4-ac68-577d14643fb1',
							'uniqueId': 'FDAFDA_yBWXdxRULVWqIqoMfMPTcYBNTjeZGz',
							'customParameter': true
						},
						{
							'parameter': 'Accounts payable, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c47a829-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'ACCOUNTS_PAYABLE_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Accrued liabilities, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c484590-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'ACCRUED_LIABILITIES_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Employee-related liabilities, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4934fc-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'EMPLOYEE_RELATED_LIABILITIES_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Taxes payable, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c49ac67-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'TAXES_PAYABLE_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Interest and dividends payable, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4a5e53-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'INTEREST_AND_DIVIDENDS_PAYABLE_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Debt, Current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4b1c74-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'DEBT_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Deferred tax liabilities, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4bc602-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'DEFERRED_TAX_LIABILITIES_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Liabilities of disposal group, including discontinued operation, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4c59ad-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'LIABILITIES_OF_DISPOSAL_GROUP_INCLUDING_DISCONTINUED_OPERATION_CURRENT',
							'customParameter': false
						},
						{
							'parameter': 'Other liabilities, current',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4cf54c-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'OTHER_LIABILITIES_CURRENT',
							'customParameter': false
						}
					],
					'totalCurrent': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'total': [
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
				'equity': {
					'equityData': [
						{
							'parameter': 'Stockholders’ equity attributable to parent',
							'data': [
								{
									'timeLine': '2017',
									'value': 100
								},
								{
									'timeLine': '2018',
									'value': 100
								}
							],
							'id': '0c4dd1d7-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'STOCKHOLDERS_EQUITY_ATTRIBUTABLE_TO_PARENT',
							'customParameter': false
						},
						{
							'parameter': 'Preferred & common stock (issued minus unissued)',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4e6aa6-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'PREFERRED_COMMON_STOCK_ISSUED_MINUS_UNISSUED',
							'customParameter': false
						},
						{
							'parameter': 'Additional paid in capital',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c4f66b8-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'ADDITIONAL_PAID_IN_CAPITAL',
							'customParameter': false
						},
						{
							'parameter': 'Treasury stock, value',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c500058-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'TREASURY_STOCK_VALUE',
							'customParameter': false
						},
						{
							'parameter': 'Accumulated other comprehensive income (loss), net of tax',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c507a42-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'ACCUMULATED_OTHER_COMPREHENSIVE_INCOME_LOSS_NET_OF_TAX',
							'customParameter': false
						},
						{
							'parameter': 'Retained earnings (accumulated deficit)',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c50fafe-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'RETAINED_EARNINGS_ACCUMULATED_DEFICIT',
							'customParameter': false
						},
						{
							'parameter': 'Other stockholders’ equity, including portion attributable to noncontrolling interest',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c519a8d-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'OTHER_STOCKHOLDERS_EQUITY_INCLUDING_PORTION_ATTRIBUTABLE_TO_NONCONTROLLING_INTEREST',
							'customParameter': false
						},
						{
							'parameter': 'Stockholders’ equity attributable to noncontrolling interest',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c521a9f-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'STOCKHOLDERS_EQUITY_ATTRIBUTABLE_TO_NONCONTROLLING_INTEREST',
							'customParameter': false
						},
						{
							'parameter': 'Stockholders’ equity, including portion attributable to noncontrolling interest',
							'data': [
								{
									'timeLine': '2017',
									'value': 0
								},
								{
									'timeLine': '2018',
									'value': 0
								}
							],
							'id': '0c52facd-abac-11e8-b6f2-0e141bdeec76',
							'uniqueId': 'STOCKHOLDERS_EQUITY_INCLUDING_PORTION_ATTRIBUTABLE_NONCONTROLLING_INTEREST',
							'customParameter': false
						}
					],
					'totalEquity': [
						{
							'timeLine': '2017',
							'value': 100
						},
						{
							'timeLine': '2018',
							'value': 100
						}
					]
				},
				'total': [
					{
						'timeLine': '2017',
						'value': 100
					},
					{
						'timeLine': '2018',
						'value': 100
					}
				]
			}
		},
		'incomeStatementData': {
			'grossProfitParams': [
				{
					'parameter': 'Revenue',
					'data': [
						{
							'timeLine': '2017',
							'value': 100
						},
						{
							'timeLine': '2018',
							'value': 100
						}
					],
					'id': '0c537ed4-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'REVENUE',
					'incomeParamType': 'INCOME',
					'customParameter': false
				},
				{
					'parameter': 'Cost of Sales',
					'data': [
						{
							'timeLine': '2017',
							'value': 200
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c53f320-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'COST_OF_SALES',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				}
			],
			'grossProfit': [
				{
					'timeLine': '2017',
					'value': -100
				},
				{
					'timeLine': '2018',
					'value': 100
				}
			],
			'opProfitParams': [
				{
					'parameter': 'Operating costs and expenses',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c547860-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'OPERATING_COSTS_AND_EXPENSES',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Selling and marketing expense',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5549b8-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'SELLING_AND_MARKETING_EXPENSE',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'General and administrative expense',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c55d7fe-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'GENERAL_AND_ADMINISTRATIVE_EXPENSE',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Provision for doubtful accounts',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c565187-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'PROVISION_FOR_DOUBTFUL_ACCOUNTS',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Other general expense',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c56d7a0-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'OTHER_GENERAL_EXPENSE',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Depreciation Expense',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c575624-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'DEPRECIATION_EXPENSE',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Other operating income',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c57d1e4-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'OTHER_OPERATING_INCOME',
					'incomeParamType': 'INCOME',
					'customParameter': false
				}
			],
			'opProfit': [
				{
					'timeLine': '2017',
					'value': -100
				},
				{
					'timeLine': '2018',
					'value': 100
				}
			],
			'profitBeforeTaxParams': [
				{
					'parameter': 'Interest Expense',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c584d03-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'INTEREST_EXPENSE',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Nonoperating income',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c58d157-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'NONOPERATING_INCOME',
					'incomeParamType': 'INCOME',
					'customParameter': false
				},
				{
					'parameter': 'Nonoperating expense',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c596aab-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'NONOPERATING_EXPENSE',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				},
				{
					'parameter': 'Gain (loss) on sale of property plant equipment',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c59fb3c-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'GAIN_LOSS_ON_SALE_OF_PROPERTY_PLANT_EQUIPMENT',
					'incomeParamType': 'INCOME',
					'customParameter': false
				},
				{
					'parameter': 'Income (loss) from equity method investments',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5aa6b3-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'INCOME_LOSS_FROM_EQUITY_METHOD_INVESTMENTS',
					'incomeParamType': 'INCOME',
					'customParameter': false
				}
			],
			'profitBeforeTax': [
				{
					'timeLine': '2017',
					'value': -100
				},
				{
					'timeLine': '2018',
					'value': 100
				}
			],
			'incomeLossContParams': [
				{
					'parameter': 'Income tax expense (benefit)',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5b2961-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'INCOME_TAX_EXPENSE_BENEFIT',
					'incomeParamType': 'EXPENSE',
					'customParameter': false
				}
			],
			'incomeLossCont': [
				{
					'timeLine': '2017',
					'value': -100
				},
				{
					'timeLine': '2018',
					'value': 100
				}
			],
			'compIncomeParams': [
				{
					'parameter': 'Income (loss) from discontinued operations, net of tax, including portion attributable to noncontrolling interest',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5bb8fd-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'INCOME_LOSS_FROM_DISCONTINUED_OPERATIONS_NET_OF_TAX_INCLUDING_PORTION_ATTRIBUTABLE_TO_NONCONTROLLING_INTEREST',
					'incomeParamType': 'INCOME',
					'customParameter': false
				},
				{
					'parameter': 'Extraordinary item, gain (loss), net of tax, including portion attributable to noncontrolling interest',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5c3de9-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'EXTRAORDINARY_ITEM_GAIN_LOSS_NET_OF_TAX_INCLUDING_PORTION_ATTRIBUTABLE_TO_NONCONTROLLING_INTEREST',
					'incomeParamType': 'INCOME',
					'customParameter': false
				},
				{
					'parameter': 'Net income (loss) attributable to noncontrolling interest',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5d048a-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'NET_INCOME_LOSS_ATTRIBUTABLE_TO_NONCONTROLLING_INTEREST',
					'incomeParamType': 'INCOME',
					'customParameter': false
				},
				{
					'parameter': 'Other comprehensive income (loss), net of tax, portion attributable to parent',
					'data': [
						{
							'timeLine': '2017',
							'value': 0
						},
						{
							'timeLine': '2018',
							'value': 0
						}
					],
					'id': '0c5d86ab-abac-11e8-b6f2-0e141bdeec76',
					'uniqueId': 'OTHER_COMPREHENSIVE_INCOME_LOSS_NET_OF_TAX_PORTION_ATTRIBUTABLE_TO_PARENT',
					'incomeParamType': 'INCOME',
					'customParameter': false
				}
			],
			'compIncomeLoss': [
				{
					'timeLine': '2017',
					'value': -100
				},
				{
					'timeLine': '2018',
					'value': 100
				}
			],
			'totalIncome': [
				{
					'timeLine': '2017',
					'value': -100
				},
				{
					'timeLine': '2018',
					'value': 100
				}
			]
		},
		'cashFlowData': cashFlowData,
		'financeStatementType': 'CASH_FLOW',
		'deletedCustomParameters': null,
		'validateFinStmt': true,
		'bsSaved': true,
		'isSaved': true,
		'cfSaved': false
	};

	const deletedDataObject = {
		'data': [{
			'timeLine': '2017',
			'value': 10
		}, {
			'timeLine': '2018',
			'value': 10
		}]
	};

	const errorObj = {
		'headers': 'Headers',
		'ok': false,
		'status': 412,
		'statusText': 'OK',
		'type': 2,
		'url': 'https://devfinservice.cyncsoftware.com/api/v1/financial-statement/project/75a244da-70f6-462f-b638-188e6ad6c6d6',
		'_body': '{"error":{"timestamp":"2018-09-21T08:26:13Z","code":"PRECONDITION_FAILED",\
			"message":"In Balance Sheet, Total Assets or (Total Liabilities + Equity) should not be zero",\
			"path":"/api/v1/financial-statement/project/75a244da-70f6-462f-b638-188e6ad6c6d6",\
			"source":"Financial Analyzer"}}'
	};

	const createRouterStateSnapshot = function () {
		const routerStateSnapshot = jasmine.createSpyObj('RouterStateSnapshot', ['toString', 'root']);
		routerStateSnapshot.root = jasmine.createSpyObj('root', ['firstChild']);
		routerStateSnapshot.root.firstChild.data = {
			xxx: false
		};
		return routerStateSnapshot;
	};

	class MockServices {
		public events = Observable.of(new RoutesRecognized(2, '/', '/', createRouterStateSnapshot()));
	}

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RouterTestingModule,
				FormsModule,
				ReactiveFormsModule,
				HttpClientModule,
				RadioButtonModule
			],
			declarations: [FinancialStatementsSetupCashflowComponent],
			providers: [
				APIMapper,
				Helper,
				MessageServices,
				APIMessagesService,
				FinancialStatementsService,
				RadioButtonService,
				CommonAPIs,
				{ provide: ActivatedRoute, useClass: MockActivatedRoute },
				{ provide: Router, useClass: MockRouter },
				{ provide: ClientSelectionService, useClass: MockClientSelectionID },
				{ provide: MessageService, deps: [] },
				{ provide: MatDialog, deps: [Overlay] },
				{ provide: CyncHttpService, deps: [] },
				{ provide: CustomHttpService, deps: [HttpClient] },
				{ provide: HttpInterceptor, deps: [HttpClient] },
				{ provide: FormBuilder, useValue: formBuilder }
			],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FinancialStatementsSetupCashflowComponent);
		component = fixture.componentInstance;
		debugElement = fixture.debugElement;
		financialStatementsService = TestBed.get(FinancialStatementsService);
		commonService = TestBed.get(CommonAPIs);
		helperService = TestBed.get(Helper);
	});

	it('should execute', () => {
		expect(component).toBeTruthy();
	});

	it('should create financial cash flow statement component', inject([Router], (router: Router) => {
		const getPeojectStatusSpy = spyOn(commonService, 'getServiceProjectStatus');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectStatusSpy, financeProjectStatus);

		const getPeojectDetailsSpy = spyOn(financialStatementsService, 'getProjectDetails');
		ServiceSpy.spyCompServiceAndReturnDataForMock(getPeojectDetailsSpy, projectDetails);
		const cashFlowDataSpy = spyOn(financialStatementsService, 'getFinancialStatements');
		ServiceSpy.spyCompServiceAndReturnDataForMock(cashFlowDataSpy, financeStatementData);

		spyOn(commonService, 'draftFinancialStmt').and.callFake((url) => {
			return Observable.of({ status: 200 });
		});

		component.previousURL = 'https://devrorapi.cyncsoftware.com/financial/financial-statement/123';
		fixture.detectChanges();
		expect(getPeojectStatusSpy).toHaveBeenCalled();
		expect(cashFlowDataSpy).toHaveBeenCalled();

		// Cancel Button Click method code coverage with url string and action type cancel
		component.previousURL = 'https://devrorapi.cyncsoftware.com/financial/financial-statement/123';
		spyOn(component, 'cancelButtonClick').and.callThrough();
		component.cancelButtonClick();
		expect(component.cancelButtonClick).toHaveBeenCalled();

		// Redirect method code coverage with url string and action type cancel
		component.previousURL = 'https://devrorapi.cyncsoftware.com/financial/financial-statement/summary/123';
		component.cancelButtonClick();
		expect(component.cancelButtonClick).toHaveBeenCalled();

		// Draft Financial statement function call
		spyOn(component, 'draftFinanceStatement').and.callThrough();

		// Should call add new custom field cash Provided By Operation Activity Params second position
		spyOn(component, 'addCustomField').and.callThrough();
		component.addCustomField('cashProvidedByOpActParams');
		expect(component.addCustomField).toHaveBeenCalled();

		// Should call add new custom field for first position
		component.addCustomField('changesInWorkingCapitalParams');
		expect(component.addCustomField).toHaveBeenCalled();

		// Should call delete custom param value method for assets
		spyOn(component, 'deleteCustomField').and.callThrough();
		component.deleteCustomField(0, 'cashProvidedByOpActParams', dummyFormGroup);
		expect(component.deleteCustomField).toHaveBeenCalled();

		// Should call update custom param value method
		spyOn(component, 'updateCustomParamValue').and.callThrough();
		component.updateCustomParamValue(0, 'New custom field', dummyFormGroup);
		expect(component.updateCustomParamValue).toHaveBeenCalled();

		// Duplicate custom parameter value validation
		const openCashFlowPopupSpy = spyOn(helperService, 'openAlertPoup');
		ServiceSpy.spyCompServiceAndReturnDataForMock(openCashFlowPopupSpy, '');
		component.updateCustomParamValue(0, 'newnew', dummyFormGroup);
		expect(component.updateCustomParamValue).toHaveBeenCalled();

		// Duplicate custom parameter empty value validation
		component.updateCustomParamValue(0, '', dummyFormGroup);
		expect(component.updateCustomParamValue).toHaveBeenCalled();

		// Should call Operating Activity Net Income update deleted custom field total value condition
		spyOn(component, 'updateDeletedCustomFieldTotalValue').and.callThrough();
		component.updateDeletedCustomFieldTotalValue(deletedDataObject, 'cashProvidedByOpActParams');
		expect(component.updateDeletedCustomFieldTotalValue).toHaveBeenCalled();

		// Should call Operating Activity Working Capital  update deleted custom field total value condition
		component.updateDeletedCustomFieldTotalValue(deletedDataObject, 'changesInWorkingCapitalParams');
		expect(component.updateDeletedCustomFieldTotalValue).toHaveBeenCalled();

		// Should call Investing Activities update deleted custom field total value condition
		component.updateDeletedCustomFieldTotalValue(deletedDataObject, 'cashUsedForInvestActParams');
		expect(component.updateDeletedCustomFieldTotalValue).toHaveBeenCalled();

		// Should call Financing Activities update deleted custom field total value condition
		component.updateDeletedCustomFieldTotalValue(deletedDataObject, 'cashUsedForFinActParams');
		expect(component.updateDeletedCustomFieldTotalValue).toHaveBeenCalled();

		// Should call update Cash Flow Total method
		spyOn(component, 'updateCashFlowTotal').and.callThrough();
		component.updateCashFlowTotal('2018', control);
		expect(component.updateCashFlowTotal).toHaveBeenCalled();

		// Should call update Cash flow total method with null scenario
		component.updateCashFlowTotal('2018', nullControlValue);
		expect(component.updateCashFlowTotal).toHaveBeenCalled();

		// Should call resize the Table method
		const value = document.getElementById('cync_main_contents_wradio-list').style.height;
		spyOn(component, 'resizetheTable').and.callThrough();
		component.resizetheTable();
		expect(component.resizetheTable).toHaveBeenCalled();

	})
	);

	it('Should call register Reload Grid On Client Selection',
		inject([ClientSelectionService], (clientSelectionService: ClientSelectionService) => {
			clientSelectionService.clientSelected = Observable.of('Client');
			spyOn(component, 'registerReloadGridOnClientSelection').and.callThrough();
			component.registerReloadGridOnClientSelection();
			expect(component.registerReloadGridOnClientSelection).toHaveBeenCalled();
		})
	);

	it('Should call navigate to FA List', inject([Router], (router: Router) => {
		spyOn(router, 'navigateByUrl');
		spyOn(component, 'navigateToFAList').and.callThrough();
		component.navigateToFAList();
		expect(component.navigateToFAList).toHaveBeenCalled();
	})
	);

	it('Should call fnExtend method', () => {
		spyOn(component, 'fnExpand').and.callThrough();
		component.fnExpand();
		expect(component.fnExpand).toHaveBeenCalled();
	});

	it('should save new Cash Flow data and \'Save\' button is clicked', () => {
		component.financialStatementAPIResponse = newProjectDetails;
		const saveFinancialStatementsSpy = spyOn(financialStatementsService, 'saveFinancialStatements');
		ServiceSpy.spyCompServiceAndReturnDataForMock(saveFinancialStatementsSpy, newProjectDetails);

		spyOn(component, 'saveCashFlow').and.callThrough();
		component.saveCashFlow(financeStatementData);
		expect(component.saveCashFlow).toHaveBeenCalled();
	});

	it('should update the Cash Flow data and \'Save\' button is clicked', () => {
		component.financialStatementAPIResponse = projectDetails;
		const updateFinancialStatementsSpy = spyOn(financialStatementsService, 'updateFinancialStatements');
		ServiceSpy.spyCompServiceAndReturnDataForMock(updateFinancialStatementsSpy, projectDetails);

		const openCashFlowPopupSpy = spyOn(helperService, 'cashFlowPopup');
		ServiceSpy.spyCompServiceAndReturnDataForMock(openCashFlowPopupSpy, false);

		spyOn(component, 'cashFlowUpdatePopup').and.callThrough();
		component.cashFlowUpdatePopup(financeStatementData, errorObj);
		expect(component.cashFlowUpdatePopup).toHaveBeenCalled();

		// Cash flow popup window test modify condition.
		spyOn(component, 'saveCashFlow').and.callThrough();
		component.saveCashFlow(financeStatementData);
		expect(component.saveCashFlow).toHaveBeenCalled();
	});

	it('should call cash Flow Update Popup method with override condition', () => {
		const openCashFlowPopupSpy = spyOn(helperService, 'cashFlowPopup');
		ServiceSpy.spyCompServiceAndReturnDataForMock(openCashFlowPopupSpy, true);
		spyOn(component, 'cashFlowUpdatePopup').and.callThrough();
		component.cashFlowUpdatePopup(financeStatementData, errorObj);
		expect(component.cashFlowUpdatePopup).toHaveBeenCalled();
	});

	it('should call cash Flow Update Popup method while override condition error scenario', () => {
		const openCashFlowPopupSpy = spyOn(helperService, 'cashFlowPopup');
		ServiceSpy.spyCompServiceAndReturnDataForMock(openCashFlowPopupSpy, 0);
		spyOn(component, 'cashFlowUpdatePopup').and.callThrough();
		component.cashFlowUpdatePopup(financeStatementData, errorObj);
		expect(component.cashFlowUpdatePopup).toHaveBeenCalled();
	});
});
