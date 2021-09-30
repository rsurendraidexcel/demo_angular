export class IneligibleAdvancesModel{
    parameters : Parameters;
    ineligible_advances : IneligibleAdvancesData [];
    divisions : Divisions [];
    credit_line_or_sub_limits : CreditLineOrSubLimits;
    constructor() {

    };
}

export class Parameters{
    null : string;
    past_due_days : string;
    concentration : string;
    cap_or_exclude : string;
    cross_age : string;
    constructor() {

    };
}

export class IneligibleAdvancesData{
    account_no : string;
    account_name : string;
    ineligible_days : number;
    concentration_pct : string;
    cap_execlude : string;
    cross_age_pct : string;
    insurance_limit : string;
    ar_exclude_pct : string;
    ar_exclude_value : string;
    ineligibility_reason : string;
    constructor() {

    };
}

export class Divisions{
    division_name : string;
    collaterals : Collaterals [];
    constructor() {

    };
}

export class Collaterals{
    source : string;
    advance_rate_label : string;
    source_data : SourceData [];
    constructor() {

    };
}

export class    SourceData{
    name : string;
    advance_rate : string;
    constructor() {

    };  
}

export class CreditLineOrSubLimits{
    credit_line : string;
    receivables : string;
    inventory : string;
    other_collaterals : string;
    ar_reliance : string;
    loan_balance : string;
    constructor() {

    };
}