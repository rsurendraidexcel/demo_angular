/**
* Term code model
*/
export class TermCodeModel {
    id: string;
    name: string;
    description: string;
    days: string;
    status: string;
}

/**
* Request body model while create/update
*/
export class TermCodeRequestModel {
    term_code: TermCodeModel;
}