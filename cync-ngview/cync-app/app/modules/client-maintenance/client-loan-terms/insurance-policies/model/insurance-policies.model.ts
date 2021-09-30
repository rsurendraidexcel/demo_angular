/**
* model for insurance api
* @class - InsPoliciesModel
*/
export class InsPoliciesModel {
    legal_name: string;
    insurance_name: string;
    amount: number;
    constructor() {
    };
}

/**
* update request body
* @class - UpdateRequestBody
*/
export class UpdateRequestBody {
    insurance_policy: InsPoliciesModel;
}