/**
* Collateral Advance rate model
*/
export class ListCollateralAdvanceRate {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    seasonal_advance_rate: CollateralAdvanceRates[];
    constructor() { };
}

/**
* Collateral Advance rate sub model
*/
export class CollateralAdvanceRates {
    id: number;
    source: string;
    name: string;
    sublimit: string;
    nolv_value: string;
    advance_rate: string;
    adjusted_advance_rate: string;
    low_value: string;
    high_value: string;
    ineligible: boolean;
    ineligibility_reason_id: number;
    currency_id: number;
    based_on: string;
    calculated_cap_by: string;
    cap_pct: string;
    borrower_id: number;
    division_code_id: number;
}

/**
* Advance rate division model
*/
export class ListDivisions {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    divisionscode: Division[];
    constructor() { };
}

/**
* Advance rate division sub model
*/
export class Division {
    id: number;
    name: string;
    description: string;
    borrower_id: number;
    constructor() { };
}

/**
* Advance rate division request body model
*/
export class AddOrUpdateAdvanceRateDivisionRequest {
    division_code: AddOrUpdateAdvacneRateDivision;
    constructor() { }
}

/**
* Advance rate division request body sub model
*/
export class AddOrUpdateAdvacneRateDivision {
    name: string;
    description: string;
    constructor() { }
}

