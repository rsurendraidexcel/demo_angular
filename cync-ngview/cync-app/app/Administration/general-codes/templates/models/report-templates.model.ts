/**
* Lender API Response model
*/
export class LenderAPIResponseModel {
	lender_details: LenderDetailsModel;
}

/**
* Lender detail export default value model
*/
export class LenderDetailsModel {
	export_default_value: ExportDefaultModel;
}

/**
* Export default model
*/
export class ExportDefaultModel {
	place_holder: string[];
	split_holder: string;
}

/**
* Place holder choice model
*/
export class PlaceHolderChoiceModel {
	id: number;
	name: string;
	value: string;
}