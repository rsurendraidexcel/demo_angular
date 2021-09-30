
/**
 * Model class for all charge codes
 */
export class AllChargeCodes {
  recordTotal: number;
  charge_code : Array<ChargeCodes>;
}

/**
 * Model class for Charge Codes
 */
export class ChargeCodes  {
  id: number;
  sequence: number;
  frequency: string;
  add_to_borrower: boolean;
  natural_sign: string;
  charge_type: string;
  description: string;
  trans_code: string;
  charge_value: number;
  posting_type:string
}

/**
 * Model class for add and edit scenarios
 */
export class AddEditChargeCodes{
  charge_code : ChargeCodes
}

/**
 * Model class for dropdown values
 */
export class Dropdown{
  value:string;
  text:string;
  show:boolean = true;
}


