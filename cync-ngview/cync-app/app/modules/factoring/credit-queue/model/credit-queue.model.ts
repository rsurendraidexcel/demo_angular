
/**
 * Model class for all list credit queue
 */
export class AllCreditQueue {
    recordTotal: number;
    credit_queue : Array<ListCreditQueue>;
  }

  /**
 * Model class for list credit queue
 */
export class ListCreditQueue  {
    request_no: any;
    client_name: any;
    debtor_name: any;
    current_limit: any;
    requested_limit: any;
    approved_limit: any;
    status: string;
    date_and_time_of_request: string;
    user_name: string;
    id:any;
}

/**
 * Model class for debtor dropdown values
 */
export class DebtorDropdown{
    id:any;
    account_name:string;
    credit_limit:string;
  }

  
/**
 * Model class for client dropdown values
 */
export class ClientDropdown{
    id:any;
    client_name:string;
  }
  
  