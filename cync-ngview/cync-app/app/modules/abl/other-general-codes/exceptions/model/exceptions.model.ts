/**
 * Exceptions api response model
 * https://s3.amazonaws.com/cync-raml/raml/admin_module.html#general_codes_lender_exceptions_get
 */
export class ExceptionListApiResponseModel {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    lender_exception: ExceptionDetail[];
}

/**
 * Model for Exception details
 */
export class ExceptionDetail {
    id: number;
    display_label: string;
    description: string;
    operator: string;
    value_type: string;
    value_type_name: string;
    exception_value: string;
    system_defined: boolean;
    system_defined_str: string;
    add_to_all_clients: boolean;
}


/**
 * Model for Exception Post Request
 */
export class LenderExceptionRequestBody {
    lender_exception: ExceptionDetail;
}

/** 
 * Model for Operator Or value type Dropdown
*/
export class OperatorOrValueTypeListModel {
    operators: OperatorsValueDetail[];
    value_types: valueTypesDetail[];

}

/** 
 * Model for operator dropdown
*/
export class OperatorsValueDetail {
    value: string;
    display: string;
}


/** 
 * Model for Value Type dropdown
*/
export class valueTypesDetail {
    value: string;
    display: string;
}