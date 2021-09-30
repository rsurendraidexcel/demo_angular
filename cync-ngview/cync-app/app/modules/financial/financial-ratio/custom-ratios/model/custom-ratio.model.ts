/**
 * Model Class for Custom Formulas in ratio
 */
export class customRatio {
	'id' : string;
	'ratio': ratioCategories;
	'formulaName': string;
	'expression': string;
	'clientId': string;
	'variables': string[];
}

/**
* Model class for all Financial Categories
*/
export class ratioCategories {
	id: string;
	name: string;
	show: boolean = true;
}