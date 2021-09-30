/**
* api model
*
*/
export class APBucket {
    bucket_number: number;
    bucket_days: number;
    bucket_name: string;
    constructor() {
    };
}

/**
* UpdateAPRequestBody
*
*/
export class UpdateAPRequestBody{
    payable_bucket_aging : APBucket;
}