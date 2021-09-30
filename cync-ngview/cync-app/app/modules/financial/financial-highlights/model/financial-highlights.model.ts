
/**
 * Model class for Financial Highlights Key Financials
 */
export class highlightsModel {
	keyFinancials: finData[];
	keyBalanceSheetData: balancesheetData[];
}

export class finData {
	heading: string;
	timeLines: string[];
	data: string[];
	yoys: string[];
	financeHighlightGraphType: string;
	type: string;
	lastValue: string;
	lastYoy: string;
	total: boolean;
}

export class balancesheetData {
	heading: string;
	timeLines: string[];
	data: string[];
	yoys: string;
	total: boolean;
}