
/**
* Interest rate code API result model
*/
export class InterestRateCodesModel {
  recordTotal: number;
  offset: number;
  interestRateCodes: Array<InterestRateCodes>;
  constructor() { };
}

/**
* Interest rate code sub model
*/
export class InterestRateCodes {
  rate_code: string;
  rate_name: string;
  rate_description: string;
  rate_divisor: number;
  rate_precision: number;
  loan_type: string;
}

/**
* Interest rate code req body model
*/
export class InterestRateCodesRequestBody {
  interest_rate_code: InterestRateCodes;
}

/**
* Interest rate code req body model
*/
export class InterestRateCodesPostModel {

  rate_code: string | "";
  rate_name: string | "";
  rate_description: string | "";
  rate_divisor: number | "";
  rate_precision: number | "";
  loan_type: string | "";
  status: string | "";
  approverComments: string | "";
}

/**
* Interest rate API response model
*/
export class InterestRatesModel {
  recordTotal: number;
  interest_rates: Array<InterestDetails>;
  constructor() { };
}

/**
* Interest rate request body model
*/
export class InterestRateRequestBody {
  interest_rate: InterestDetails;
  constructor() { };
}

/**
* Interest rate sub model
*/
export class InterestDetails {
  rate_date: Object;
  rate_value: string;
  interest_rate_code_id: number;
}

/**
* Loan model
*/
export class LoanModel {
  value: string;
  text: string;
  constructor() { };
}

/**
* Calendar Year Range Model
*/
export class CalendarYearModel{
  start_year: number;
  end_year: number;
}

