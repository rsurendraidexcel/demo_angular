
export class ClientApiResponse {
    borrower: ClientDetails;
}

// export class ClientDetails {
//     client_name: string;
//     short_name: string;
//     client_number: string;
//     bbc_frequency: string;
//     active: boolean;
//     email_id: string;
//     description: string;
//     processing_type: string;
//     original_amount: string;
//     limit_amount: string;
//     client_url: string;
//     account_reference: string;
//     activation_start_dt: any;
//     activation_end_dt: any;
//     loan_dt: any;
//     latest_snapshot_id: any;
//     currency_id: number;
//     naics_code_id: number;
//     parent_client_id: any;
//     bbc_frequency_date: string;
//     bbc_period: string;
//     bbc_day: string;
//     tax_id: any;
//     country_id: any;
//     state_province_id: any;
//     company_type: any;
//     term: any;
//     branch: any;
//     sales_region_id: any;
//     minimum_balance_amount: string;
//     ucc_number: any;
//     ucc_filling_date: any;
//     cash_controls: any;
//     risk_rating_code: any
// }

export class ClientDetails {
    client_name: string;
    short_name: string;
    client_number: string;
    naics_code_id: string;
    currency_id: string;
    parent_client_id: string;
    email_id: string;
    client_url: string;
    description: string;
    company_type: string;
    account_reference: string;
    limit_amount: string;
    minimum_balance_amount: string;
    date_established: string;
    risk_rating_code: string;
    tax_id: string;
    expiration_date: string;
    term: string;
    branch: string;
    sales_region_id: string;
    country_id: string;
    state_province_id: string;
    ucc_number: string;
    ucc_filling_date: string;
    status: string;
}

export class Country {
    id: number;
    name: string;
    country_cd2: string;
    country_cd3: string;
    currency_id: number;
    created_at: Date;
    updated_at: Date;
}

export class State {
    id: number;
    code: string;
    name: string;
    country_id: number;
    created_at: Date;
    updated_at: Date;
}

export class Borrower {
    id: number;
    client_name: string;
    short_name: string;
    client_number: string;
    bbc_frequency: string;
    active: boolean;
    email_id: string;
    processng_type: string;
    original_amount: string;
    limit_amount: string;
    bbc_frequency_date: string;
    naics_code_id: number;
    ucc_number: any;
    ucc_filling_date: any;
}

export class BorrowerResponse {
    pagesTotal: number;
    borrowers: Borrower[];
}

export class Currency {
    id: number;
    currency_cd: string;
    description: string;
    decimal_precision: number;
}

export class CurrenciesResponse {
    recordTotal: number;
    currencies: Currency[];
}

export class SalesRegion {
    id: number;
    region: string;
    name: string;
}

export class SalesRegionResponse {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    sales_regions: SalesRegion[];
}

export class NaicsCode {
    id: number;
    code: string;
    description: string;
}

export class NaicsCodeResponse {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    naics_codes: NaicsCode[];
}

export class NaicsCodeCombined{
    id: number;
    naics_code: string;
}

export class ClientAddress{
    address_code: string;
    name_primary: string;
    name_alternate: string;
    city: string;
    state_province_id: string;
    zip_code: number;
    country_id: number;
    phones: PhoneAttribute[];
}

export class PhoneAttribute{
    phone_type:string;
    phone_no: string;
}

export class UpdatePhoneAttribute{
    id:number;
    phone_type:string;
    phone_no: string;
}
