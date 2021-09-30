/**
 *  Model class for ABL Basic Parameter
 *  http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/client-maintenance.html#borrowers__id__parameter_get
 */
export class BasicParameters {
    id: number;
    concentration_report_threshold: string;
    collateral_change_pct: string;
    invoice_max_amt: string;
    send_audit_letter_in_days: string;
    default_invoice_status: string;
    accept_duplicate: string;
    combine_summ_det_ar_yn: string;
    maintain_current_ar: string;
    add_cash_from_batch_to_rollforward: string;
    division_or_all_in_rollforward: string;
    receivable_sublimit: string;
    receivable_sublimit_based_on: string;
    receivable_sublimit_max_cap_pct: string;
    receivable_sublimit_calculated_cap_by: string;
    inventory_sublimit: string;
    inventory_sublimit_based_on: string;
    inventory_sublimit_max_cap_pct: string;
    inventory_sublimit_calculated_cap_by: string;
    other_sublimit: string;
    other_collateral_based_on: string;
    other_collateral_max_cap_pct: string;
    other_collateral_calculated_cap_by: string;
    auto_calculate_nolv: string;
    lesser_of_pct_cost_or_nolv: string;
    min_liq_cost: string;
    percentage_of_var_liq_cost: string;
    liq_cost: string;
    percentage_of_nolv: string;
    percentage_of_cost: string;
    ar_reliance_pct: string;
    ar_or_inventory: boolean;
    inventory_with_sublimit: boolean;
    loan_amt_pct: string;
    ar_reliance_based_on: string;
    ar_reliance_max_cap_pct: string;
    ar_reliance_calcaulated_cap_by: string[];
    concentration_pct: string;
    conc_pct_type: string;
    cross_aging_pct: string;
    cross_aging_by_project: boolean;
    consider_past_due_for_cross_age: boolean;
    cross_age_past_due_days: number;
    cross_age_past_due_pct: string;
    ar_aging_days: number;
    include_credits_in_past_age_due: boolean;
    only_positive_past_due: boolean;
    aged_credit_by_balance: boolean;
    net_credit_ineligible: boolean;
    ineligible_past_due_flag: string;
    ineligible_aged_credit_flag: string;
    age_credit_ineligible: string;
    include_negative_ineligibles: boolean;
    aging_starts_from_inv_date: boolean;
    age_by_due_dt: boolean;
    eligible_period_term_days: number;
    current_bucket_is_0_or_less: boolean;
    over_invoice_days: number;
    ineligible_calculate_by: string;
    ignore_negative_inventory_available: boolean;
    display_inventory_ineligibles: boolean;
    interest_rate_code_id: number;
    parameter_rate_adjust: string;
    min_interest_rate: string;
    max_interest_rate: string;
    post_to_loan_activity: boolean;
    post_advance_to_loan_activity: boolean;
    include_batch_in_bbc: boolean;
    allow_over_advance: boolean;
    over_advance_pct: number;
    fund_send_by: number;
}

/**
 * Model for BBC options
 * http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/client-maintenance.html#borrowers_summary_borrower_bbc_options_get
 */
export class BBCOptions {
    id: number;
    receivable: boolean;
    rollfwd: boolean;
    ineligible: boolean;
    inventory: boolean;
    other_collateral: boolean;
    reserves: boolean;
}

/**
 * Model for borrower details
 * http://cync-raml.s3-website-us-east-1.amazonaws.com/raml/client-maintenance.html#borrowers__id__get
 */
export class BorrowerDetails {
    client_name: string;
    short_name: string;
    client_number: string;
    bbc_frequency: string;
    active: boolean;
    email_id: string;
    description: string;
    processing_type: string;
    original_amount: string;
    limit_amount: string;
    client_url: string;
    account_reference: string;
    activation_start_dt: string;
    activation_end_dt: string;
    loan_dt: string;
    latest_snapshot_id: string;
    currency_id: string;
    naics_code_id: string;
    parent_client_id: string;
    bbc_frequency_date: Date;
    bbc_period: string;
    bbc_day: string;
    tax_id: string;
    country_id: string;
    state_province_id: string;
    company_type: string;
    term: string;
    branch: string;
    sales_region_id: string;
    minimum_balance_amount: string;
    ucc_number: string;
    ucc_filling_date: string;
    cash_controls: string;
    risk_rating_code: string;
}

/**
 * borrower api response model
 */
export class BorrowerDetailsAPIResponse {
    borrower: BorrowerDetails;
}

/**
 * parameter api response model 
 */
export class BorrowerParameterAPIResponse {
    parameter: BasicParameters;
}

