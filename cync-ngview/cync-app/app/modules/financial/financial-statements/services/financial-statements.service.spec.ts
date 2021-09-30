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
import { CommonAPIs } from '@cyncCommon/utils/common.apis';
import { FinancialStatementsService } from './financial-statements.service';
import { ServiceSpy } from '@cyncCommon/component/test/shared-test';
import { FinancialStatementModel, ParameterDataModel, TimelineValuesModel } from '../models/financial-statements.model';

let financialStatementsService: FinancialStatementsService;
let cyncHttpService: CyncHttpService;
let commonAPIs: CommonAPIs;

let apiMapper: APIMapper;
let helper: Helper;

const mockFinanceStatementUrl = 'financial/financial-analyzer/123/financial-statement';
const uploadFileURL = 'financial-statement/project/b08a07b3-4697-46c3-bd2b-2b131fa577cb/upload';
const formData = new FormData();

const financeStatementData = {
	'id': null,
	'projectId': '8d5367cf-a41a-4d5a-8e5e-d6e80812f295',
	'timeLinesList': [
		'2017',
		'2018'
	],
	'balanceSheetData': {
		'assets': {
			'nonCurrentData': [
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					'parameter': 'Cash, cash equivalents, and short-term investments',
					'data': [
						{
							'timeLine': '2017',
							'value': 100
						},
						{
							'timeLine': '2018',
							'value': 200
						}
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
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
					]
				}
			],
			'totalCurrent': [
				{
					'timeLine': '2017',
					'value': 100
				},
				{
					'timeLine': '2018',
					'value': 200
				}
			],
			'total': [
				{
					'timeLine': '2017',
					'value': 100
				},
				{
					'timeLine': '2018',
					'value': 200
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
						]
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
						]
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
						]
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
						]
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
						]
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
						'parameter': 'Accounts payable, current',
						'data': [
							{
								'timeLine': '2017',
								'value': 100
							},
							{
								'timeLine': '2018',
								'value': 200
							}
						]
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
						]
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
						]
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
						]
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
						]
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
						]
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
						]
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
						]
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
						]
					}
				],
				'totalCurrent': [
					{
						'timeLine': '2017',
						'value': 100
					},
					{
						'timeLine': '2018',
						'value': 200
					}
				],
				'total': [
					{
						'timeLine': '2017',
						'value': 100
					},
					{
						'timeLine': '2018',
						'value': 200
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
								'value': 0
							},
							{
								'timeLine': '2018',
								'value': 0
							}
						]
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
						]
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
						]
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
						]
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
						]
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
						]
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
						]
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
						]
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
						]
					}
				],
				'totalEquity': [
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
			'total': [
				{
					'timeLine': '2017',
					'value': 100
				},
				{
					'timeLine': '2018',
					'value': 200
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
				'incomeParamType': 'INCOME'
			},
			{
				'parameter': 'Cost of Sales',
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
				'incomeParamType': 'EXPENSE'
			}
		],
		'grossProfit': [
			{
				'timeLine': '2017',
				'value': 100
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'INCOME'
			}
		],
		'opProfit': [
			{
				'timeLine': '2017',
				'value': 100
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'INCOME'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'EXPENSE'
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
				'incomeParamType': 'INCOME'
			}
		],
		'profitBeforeTax': [
			{
				'timeLine': '2017',
				'value': 100
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
				'incomeParamType': 'EXPENSE'
			}
		],
		'incomeLossCont': [
			{
				'timeLine': '2017',
				'value': 100
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
				'incomeParamType': 'INCOME'
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
				'incomeParamType': 'INCOME'
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
				'incomeParamType': 'INCOME'
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
				'incomeParamType': 'INCOME'
			}
		],
		'compIncomeLoss': [
			{
				'timeLine': '2017',
				'value': 100
			},
			{
				'timeLine': '2018',
				'value': 100
			}
		],
		'totalIncome': [
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
	'financeStatementType': null
};
const financeStmtSummaryResponse: any = {
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
	}
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

const downloadExcelData: any = {
	'size': 58292,
	'type': 'application/vnd.ms-excel'
};

describe('FinancialStatementsService', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			providers: [FinancialStatementsService,
				CyncHttpService,
				Helper,
				APIMapper,
				CommonAPIs,
				MatDialog,
				APIMessagesService,
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
		financialStatementsService = TestBed.get(FinancialStatementsService);
		cyncHttpService = TestBed.get(CyncHttpService);
		commonAPIs = TestBed.get(CommonAPIs);
		helper = TestBed.get(Helper);
		apiMapper = TestBed.get(APIMapper);
	});

	it('should get financial statement data', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, financeStatementData);

		financialStatementsService.getFinancialStatements(mockFinanceStatementUrl).subscribe(financialStatementsResponse => {
			expect(JSON.stringify(financialStatementsResponse)).toBe(JSON.stringify(financeStatementData));
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should save financial statement data', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'postService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, financeStatementData);

		financialStatementsService.saveFinancialStatements(mockFinanceStatementUrl,
			FinancialStatementModel).subscribe(financialStatementsResponse => {
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should update financial statement data', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'putService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, financeStatementData);

		financialStatementsService.updateFinancialStatements(mockFinanceStatementUrl,
			FinancialStatementModel).subscribe(financialStatementsResponse => {
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should get financial statement summary data', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, financeStmtSummaryResponse);

		financialStatementsService.getFinancialStatementSummary(mockFinanceStatementUrl).subscribe(summaryDataResponse => {
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should get Project details', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'getService');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, projectDetails);

		financialStatementsService.getProjectDetails(mockFinanceStatementUrl).subscribe(projectDetailsDummy => {
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should upload financial statement data file', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'uploadFileFinance');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, projectDetails);

		financialStatementsService.uploadFile(uploadFileURL, formData).subscribe(uploadFileResponse => {
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});

	it('should download financial statement excel template ', () => {
		const cyncHttpServiceSpy = spyOn(cyncHttpService, 'downloadFinanceTemplate');
		ServiceSpy.spyCyncHttpServiceReturnDataForMock(cyncHttpServiceSpy, downloadExcelData);

		financialStatementsService.downloadExcelTemplate(mockFinanceStatementUrl).subscribe(downloadExcelResult => {
		});
		expect(cyncHttpServiceSpy.calls.count()).toBe(1);
	});
});
