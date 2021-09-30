/**
* model for country api
* @class - Country
*/
export class Country {
    id: number;
    name: string;
    country_cd2: string;
    country_cd3: string;
    currency_id: number;
    created_at: Date;
    updated_at: Date;
}

/**
* model for state api
* @class - State
*/
export class State {
    id: number;
    code: string;
    name: string;
    country_id: number;
    created_at: Date;
    updated_at: Date;
}

/**
* model for naicsCode api
* @class - NaicsCode
*/
export class NaicsCode {
    id: number;
    code: string;
    description: string;
}

/** 
* model for naicsCode api response
* @class - NaicsCodeResponse
*/
export class NaicsCodeResponse {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    naics_codes: NaicsCode[];
}

export class NaicsCodeCombined {
    id: number;
    naics_code: string;
}
/**
* model for corporate type api
* @class - CorporateType
*/
export class CorporateType {
    value: string;
    display: string;
}

/**
* model for guarantors api
* @class - Guarantors
*/
export class Guarantors {
    company_name: string;
    federal_id: string;
    country_id: number;
    state_province_id: number;
    naics_code_id: number;
    corporate_type: string;
    percent_owned: number;
    constructor() {
    };
}

/**
* @class - UpdateRequestBody
* 
*/
export class UpdateRequestBody {
    guarantor: Guarantors;
}