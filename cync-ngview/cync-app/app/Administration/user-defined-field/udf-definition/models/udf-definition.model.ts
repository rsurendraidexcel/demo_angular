import { FormControl, ValidatorFn } from '@angular/forms';

/**
 * Model for UDF Definition Grid Data Response
 */
export interface ListUDFDefinitionResponse {
	recordTotal: number;
	currentPage: number;
	pagesTotal: number;
	udfs: UDFDefinition[];
}

/**
 * Model for UDF Definition Grid Columns
 */
export interface UDFDefinition {
	id: number;
	name: string;
	description: string;
	field_type: string;
	validation_type: string;
	active: boolean;
	status?: string;
}

/**
 * Model for UDF Definition Request or Response Payload
 */
export class UDFRequestOrReponse {
	udf: UDFDefinitionRecord;
	constructor() { }
}

/**
 * Model for Creating or Updating UDF Definition Record
 */
export interface UDFDefinitionRecord {
	id?: number;
	name: string;
	description: string;
	field_type: string;
	validation_type: string;
	active: boolean;
	is_mandatory: boolean;
	is_unique: boolean;
	is_updatable: boolean;
	is_unique_value: boolean;
	udf_value: string;
	value_length?: LengthFields;
	value_range?: RangeFields;
	list_of_values?: LOVFields[];
	is_sort_by_alphabetic?: boolean;
}

/**
 * Model for Length fields, One of the Validation Type in UDF Definition Record
 */
export interface LengthFields {
	id?: number;
	min_length: number;
	max_length: number;
	is_fixed_length: boolean;
	length_value: number;
}

/**
 * Model for Range fields, One of the Validation Type in UDF Definition Record
 */
export interface RangeFields {
	id?: number;
	range_min: number;
	range_max: number;
}

/**
 * Model for LOV fields, One of the Validation Type in UDF Definition Record
 */
export interface LOVFields {
	id?: number;
	lov_value: string;
	description: string;
	is_default_value: boolean;
}

/**
 * Model for Field Type Response Payload
 */
export interface FieldTypeList {
	field_types: Dropdown[];
}

/**
 * Model for Validation Type Response Payload
 */
export interface ValidationTypeList {
	validation_type: Dropdown[];
}

/**
 * Model for Drop Downs in UDF Definition
 */
export interface Dropdown {
	column_value: string;
	column_display: string;
}

/**
 * Model for Adding Validators to UDF Definition Form Fields
 */
export class UdfValidators {
	control: FormControl;
	validator: ValidatorFn[];
	constructor() { }
}

