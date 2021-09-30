export class FactoringFeeSetup {
    fee_setup: FeeSetup
}
export class FeeSetup {
    id: number;
    source: String;
    name: String;
    advance_rate: number;
    max_fee_percent: number;
    min_fee_days: number;
    min_per_invoice: number;
    fee_calculated_on: string;
    fee_calculation_method: string;
    fact_recourse_factoring: boolean;
    fact_recourse_days: number;
    fact_recourse_fee_pct: number;
    divisor: number;
    spread_percentage: string;
    fee_codes_attributes: FeeCode[]
}
export class FeeCode {
    tier_days: number;
    tier_percent: number;
    days_from: number;
}
