
/**
* @class PersonalGuarantorsModel
* 
*/
export class PersonalGuarantorsModel {
    legal_name: string;
    percent_owned: number;
    constructor() {
    };
}
/**
* @class UpdateRequestBody
* 
*/
export class UpdateRequestBody {
    personal_guarantor: PersonalGuarantorsModel;
}