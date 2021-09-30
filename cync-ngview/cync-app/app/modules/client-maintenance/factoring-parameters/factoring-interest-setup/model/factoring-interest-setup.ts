
export interface FactoringInterestModel {
    factoring_interest_setup: FactoringInterestSetupModel;
}
export interface FactoringInterestSetupModel {
    id: number;
    client_id: number;
    interest_to_be_charged: boolean;
    interest_charged_date: string;
    interest_rate_code_id: any;
    interest_rate_code: any;
    adjustment_rate: number;
    minimum_interest_rate: number;
    maximum_interest_rate: number;
    interest_accumulated_to:any;
    interest_accumulated: any;
    interest_compounding: any;
    interest_calculated_for: any;
    interest_frequency: any;
    interest_charged_on: any;
    interest_deducted_from_reserve:any;
    interest_starts_from: any;
}
