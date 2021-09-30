
/**
 * Model class for all Financial Ratio
 */
export class AllFinancialRatio {
	financial_ratio: Array<FinancialRatio>;
}


/**
* Model class for Financial Ratio
*/
export class FinancialRatio {
	id: number;
	name: string;
	formulas: Array<FinancialRatioFormula>;
	checked: boolean;
//	showFormula: boolean;
}

/**
* Model class for Financial Ratio Formula
*/
export class FinancialRatioFormula {
	id: string;
	name: string;
	active: boolean;
	expression: string;
	display:string;
	checked: boolean;
	operators: Array<FinancialRatioOperator>;
	benchMarkValue: number;
	customFormula : boolean;
}


/**
* Model class for Financial Ratio Operator
*/

export class FinancialRatioOperator {
	display: string;
	value: string;
	active: boolean;
	selected: boolean;
}


/**
* Model class for Financial Ratio Summary Tabular, Graph
*/

export class FinancialGraphRatioReport {
	timeperiods: string[];
	categories: FinancialGraphCategories[];
}

export class FinancialGraphCategories {

	name: string;
	datasets: FinancialGraphDataSets[];
}

export class FinancialGraphDataSets {

	label: string;
	backgroundColor: string;
	data: string[];
	tabularView: string[];

}

/**
* Model class for Financial Ratio Categories
*/
export class formulaCategories {
	id: string;
	name: string;
}