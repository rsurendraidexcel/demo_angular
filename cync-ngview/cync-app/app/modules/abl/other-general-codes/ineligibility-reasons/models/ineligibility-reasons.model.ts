

/**
 * List Ineligibility Reasons Model
 * @raml: http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/admin_module.html#general_codes_ineligibility_reasons_get
 */

export class ListIneligibilityReasonsResponse {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    ineligibility_reason: IneligibilityReasons[];
}

export class IneligibilityReasons {
    id: number;
    code: string;
    description: string;
    system_defined: boolean;
    calculate_on_negative_balance: boolean;
    calculate_on_negative_debtor_balance: boolean;
}

/**
 * Add Ineligibility Reasons Model
 * @raml: http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/admin_module.html#general_codes_ineligibility_reasons_post
 * Or Update Ineligibility Reasons Model
 * @raml :http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/admin_module.html#general_codes_ineligibility_reasons__id__patch
 */

export class AddOrUpdateIneligibilityReasons {
    code: string;
    description: string;
    calculate_on_negative_balance: boolean;

    constructor(){}
}

export class AddOrUpdateIneligibilityReasonsRequest{
    ineligibility_reason: AddOrUpdateIneligibilityReasons;

    constructor(){}
}
