/**
* Financial Statement Model
*/
export class FinancialStatementModel {
	id: string;
	projectId: string;
	timeLinesList: string[];
	balanceSheetData: BalanceSheetModel;
	incomeStatementData: IncomeStatementModel;
	cashFlowData: CashFlowModel;
	financeStatementType: string;
	deletedCustomParameters: string[];
	validateFinStmt: boolean;
}

/**
* Balance Sheet Model
*/
export class BalanceSheetModel {
	assets: AssetsLiablilitiesModel;
	equityAndLiabilities: EquityAndLiabilitiesModel;
}

/**
* Parameter Data Model
*/
export class ParameterDataModel {
	parameter: string;
	data: TimelineValuesModel[];
	customParameter: boolean;
	id: string;
	uniqueId: string;
}

/**
* Timeline Values Model
*/
export class TimelineValuesModel {
	timeLine: string;
	value: number;
}

/**
* Assets & Liablilities common Model
*/
export class AssetsLiablilitiesModel {
	nonCurrentData: ParameterDataModel[];
	totalNonCurrent: TimelineValuesModel[];
	currentData: ParameterDataModel[];
	totalCurrent: TimelineValuesModel[];
	total: TimelineValuesModel[];
}

/**
* Equity & Liabilities Model
*/
export class EquityAndLiabilitiesModel {
	liabilities: AssetsLiablilitiesModel;
	equity: EquityModel;
	total: TimelineValuesModel[];
}

/**
* Equity Model
*/
export class EquityModel {
	equityData: ParameterDataModel[];
	totalEquity: TimelineValuesModel[];
}

/**
* Income Statement Model
*/
export class IncomeStatementModel {
	grossProfitParams: IncomeStmtParamsModel[];
	grossProfit: IncomeStmtDataModel[];
	opProfitParams: IncomeStmtParamsModel[];
	opProfit: IncomeStmtDataModel[];
	profitBeforeTaxParams: IncomeStmtParamsModel[];
	profitBeforeTax: IncomeStmtDataModel[];
	incomeLossContParams: IncomeStmtParamsModel[];
	incomeLossCont: IncomeStmtDataModel[];
	compIncomeParams: IncomeStmtParamsModel[];
	compIncomeLoss: IncomeStmtDataModel[];
	totalIncome: IncomeStmtDataModel[];
}

/**
* Income statement Parameter models
*/
export class IncomeStmtParamsModel {
	parameter: string;
	data: IncomeStmtDataModel[];
	incomeParamType: string;
	customParameter: boolean;
	id: string;
	uniqueId: string;
}

/**
* Income statement data model
*/
export class IncomeStmtDataModel {
	timeLine: string;
	value: number;
}

/**
* Cash Flow Model
*/
export class CashFlowModel {
	cashProvidedByOpActParams: CashFlowParamsModel;
	changesInWorkingCapitalParams: CashFlowParamsModel;
	cashProvidedByOperatingActivitiesTotal: CashFlowDataModel;
	cashUsedForInvestActParams: CashFlowParamsModel;
	cashUsedForInvestingActivitiesTotal: CashFlowDataModel;
	cashUsedForFinActParams: CashFlowParamsModel;
	cashUsedForFinancingActivitiesTotal: CashFlowDataModel;
	incrOrDecrInCashAndCashEquiParams: CashFlowParamsModel;
	incrOrDecrInCashAndCashEquivalentsTotal: CashFlowDataModel;
	cashAndCashEquiAtYearEndParams: CashFlowParamsModel;
	cashAndCashEquiAtYearEndTotal: CashFlowDataModel;
}

/**
* Cash Flow Parameter Model
*/
export class CashFlowParamsModel {
	parameter: string;
	data: CashFlowDataModel[];
	customParameter: boolean;
	id: string;
	uniqueId: string;
}

/**
* Cash Flow data Model
*/
export class CashFlowDataModel {
	timeLine: string;
	value: number;
}