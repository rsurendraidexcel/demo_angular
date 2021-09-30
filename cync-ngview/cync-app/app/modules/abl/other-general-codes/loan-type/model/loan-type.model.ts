/**
* Loan Type Model
* 
*/
export class LoanTypeModel {
    id: string;
    loan_type_name: string;
    loan_type_desc: string;
    created_at: string;
    updated_at: string;
    constructor() {};
}

/**
* Updated Request Body Model
* 
*/
export class UpdateRequestBody {
    non_abl_loan_type: LoanTypeModel;
}