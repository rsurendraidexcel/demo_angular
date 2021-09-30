export class ListDivisions {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    divisionscode: Division[];
    constructor() { };
}

export class Division {
    id: number;
    name: string;
    description: string;
    borrower_id: number;
    constructor() { };
}

export class ListSeasonalAdvanceRate {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    seasonal_advance_rate: SeasonalAdvanceRates[];
    constructor() { };
}

export class SeasonalAdvanceRates {
    id: number;
    division_code_id: number;
    collateral_type: string;
    as_of_date: string;
    sub_limit: string;
    nolv_value: string;
    advance_rate: string;
    adjusted_advance_rate: string;
    low_value: string;
    high_value: string;
    sublimit_based_on: string;
    sublimit_calculated_cap_on: string;
    sublimit_max_cap_pct: number;
}

