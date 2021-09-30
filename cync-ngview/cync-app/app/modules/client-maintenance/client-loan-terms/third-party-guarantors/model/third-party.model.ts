
/**
*  
* @class ThirdPartyModel
*/
export class ThirdPartyModel {
    legal_name: string;
    percent_owned: number;
    constructor() {
    };
}

/**
*  
* @class UpdateRequestBody
*/
export class UpdateRequestBody {
    third_party_guarantor: ThirdPartyModel;
}