import { SelectDropDown } from "@app/shared/models/select-dropdown.model";

/**
 * Model class for UDF Mapping Summary Page
 */
export class UDFMappingSummaryModel{
    program_id:number;
    program_name:string;
    user_defined_field:UdfsSummaryModel[];
}

/**
 * Model for Udfs Summary
 */
export class UdfsSummaryModel{
    udf_name:string;
    udf_id:number;
}

/**
 * Model Class for UDF Mapping Summary Page with record total
 */
export class UDFMappingSummaryRecords{
    recordTotal:number;
    udf_mappings:UDFMappingSummaryModel[];
}

/**
 * Model for range validation data
 */
export class ValueRangeModel{
    id:number;
    range_min:number;
    range_max:number;
}

/**
 * Model for length validation data
 */
export class ValueLengthModel{
    id:number;
    min_length:number;
    max_length:number;
    is_fixed_length:boolean;
    length_value:number;
}

/**
 * Model for UDF Details data
 */
export class UDFDetailsModel{
    id:number;
    name:string;
    description:string;
    field_type:string;
    validation_type:string;
    active:boolean;
    is_sort_by_alphabetic:boolean;
    is_mandatory:boolean;
    is_unique:boolean;
    is_updatable:boolean;
    display_in_reports:boolean;
    list_of_values:UDFLOVModel[];
    value_range:ValueRangeModel;
    value_length:ValueLengthModel;
    is_unique_value:boolean;
    udf_values_for_auto_complete:any[];
    udf_value:any;
}

/**
 * Model class for validation type LOV
 */
export class UDFLOVModel{
    id:number;
    lov_value:string;
    description:string;
    is_default_value:boolean
}

/**
 * Model class for Program Details
 */
export class Program{
    id:number;
    column_value:string;
    column_display:string;
}

/**
 * Model class for Program Parameters
 */
export class ClientProgramParam{
    column_value:string;
    column_display:string;
}

/**
 * Model class for client and report mappings data
 */
export class CommonIdNameModel{
    id:number;
    name:string;
}

/*export class ListBoxModel{
    name:string;
    code:number;

    constructor(code: number, name: string) {
        this.code = code;
        this.name = name;
    }
}*/

/**
 * Model clas sto hold UDF Values
 */
export class UDFValueModel{
    id:number;
    udf_value:string;
    sequence:number;
}

/**
 * Model class for Program values
 */
export class ProgramValueModel{
    isAllProgramSelected: boolean;
    program_id:number;
    program_name:string;
    program_code:string;
    mappings:CommonIdNameModel[];
}

/**
 * Model class for udf Mapping data
 */
export class UDFMappingModel{
    udfs:UDFValueModel[];
    programs:ProgramValueModel[];
}

/**
 * Model Class for UDF to be passed to get client mappings
 */
export interface UdfIdValuePair{
    udf_id:number;
    udf_value:any;
}

/**
 * Model Class for UDF to be passed to get client mappings
 */
export class UDFModelForClientMappings{
    udfs:UdfIdValuePair[];
}
/**
 * Model class for Program Parameters
 */
export class LoanSetupProgramParam{
    column_value:string;
    column_display:string;
}