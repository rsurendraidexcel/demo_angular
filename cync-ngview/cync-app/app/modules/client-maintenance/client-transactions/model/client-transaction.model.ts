/**
 * This model for listing client transaction details
 * @raml: https://s3.amazonaws.com/cync-raml/raml/client-maintenance.html#borrowers_summary_get
 */
export class ListAblClientTransactionApiResponse {
    recordTotal: number;
    currentPage: number;
    pagesTotal: number;
    client_transaction_summary: AblClientTransactionDetail[];
}

export class AblClientTransactionDetail {
    id: number;
    client_name: string;
    last_bbc_date: string;
    manager: string;
    utilization: string;
    avg_monthly_loan_balance_amount: string;
    credit_line: string;
    collateral_value: string;
    current_balance: string;
    letter_of_credit: string;
    available_to_loan: string;
    active: boolean;
    manager_name: string[];
}


/**
 * This model for displaying total amount of clients
 * @raml: https://s3.amazonaws.com/cync-raml/raml/client-maintenance.html#borrowers_summary_total_get
 */
export class ClientTransactionTotalDetail {
    avg_monthly_loan_balance_total: string;
    limit_amount_total: string;
    current_bal_total: string;
    collateral_value_total: string;
    letter_of_credit_total: string;
    available_to_loan_total: string;
}

/**
 * This model contains only one object at a time for factoring client transaction api response
 */
export class FactoringClientTransaction {
    id: number;
    client_name: string;
    manager: string;
    funded_invoice_amount: string;
    current_ar_balance: string;
    advance_amount: string;
    escrow_reserve: string;
    cash_reserve: string;
    accured_factoring_fee: string;
    net_fund_employed: string;
    total_dilution: string;
}

/**
 * This model contains factoring client transaction api response
 */
export class FactoringClientTransactionApiResponse {
    recordTotal: number;
    currentPage: string;
    pagesTotal: number;
    summary_report: FactoringClientTransaction[];
    total_advance_amount: string;
    total_escrow_reserve: string;
    total_cash_reserve: string;
    total_accured_factoring_fee: string;
    total_net_fund_employed: string;
    total_total_dilution: string;
}