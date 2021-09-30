export class LoanFeeModel{
    reporting_requirements : ReportingRequirements [] ;
    lender_ticklers : LenderTickler [] ;
    bbc_data_files : BbcDataFiles [] ;
    loan_charges_or_fees : LoanChargesOrFees [] ;
    loan_details : LoanDetails ;
    constructor() {

    };
}

export class ReportingRequirements{
    source_documents_name : string;
    frequency : string;
    constructor() {

    };
}

export class LenderTickler{
    source_documents_name : string;
    frequency : string;
    constructor() {

    };
}

export class BbcDataFiles{
    source_documents_name : string;
    frequency : string;
    constructor() {

    };
}

export class LoanChargesOrFees{
    charge_code : string ;
    charge_value : string;
    frequency : string;
    charge_type : string ;
    constructor() {

    };
}

export class LoanDetails{
    loan_origination : string;
    contract_term : string;
    origination_date : string;
    expiration_date : string;
    interest_rate_code : string;
    rate_adjustment : string;
    interest_add_to_balance : string;
}