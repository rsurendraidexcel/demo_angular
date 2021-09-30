export class interestRateCodesModel {
  recordTotal: number;
  offset :number;
  interestRateCodes : Array<InterestRateCodes>;
}

export class InterestRateCodes  {
  rate_code: string;
  rate_name: string;
  rate_description: string;
  rate_divisor: number;
  rate_precision: number;
  loan_type: string;
}

export class InterestRateCodesPostModel{
  
  rate_code: string | "";
  rate_name: string | "";
  rate_description: string | "";
  rate_divisor: number | "";
  rate_precision: number | "";
  loan_type: string | "";
  status : string | "";
  approverComments : string | "";
}

export class interestDetailsModel  {

  recordTotal: number;
  interest_rates: Array<InterestDetails>;
}

export class InterestDetails  {

  //rate_date: Date;
  rate_date: string;
  rate_value: string;
  interest_rate_code_id: number;
}
