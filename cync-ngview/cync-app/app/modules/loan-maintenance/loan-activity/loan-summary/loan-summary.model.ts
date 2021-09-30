
export class LoanSummaryModel {
  effective_date: string;
  posted_date: string;
  client: string;
  charge_code: string;
  disbursement: number;
  repayment: number;
  principal_paid: number;
  principal_balance: number;
  interest_accrued: number;
  interest_paid: number;
  interest_balance: number;
  fee_accrued: number;
  fee_paid: number;
  fee_balance: number;
  outstanding_loan_balance: number;
  outstanding_account_balance: number;
  interest_pct: number;
  loan_status: string;
  loan_id: string;
  client_id: string;
  loan_type: string;
  loan_signed_date: string;
  batch_no: string;
  source_bbc_date: string;
  transaction_type: string;
}