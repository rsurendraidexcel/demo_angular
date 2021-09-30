/**
* api model
*
*/
export class ARBucket {
    bucket_number: number;
    bucket_days: number;
    bucket_name: string;
    constructor() {
    };
}

/**
* UpdateARRequestBody
*/
export class UpdateARRequestBody {
    bucket_ageing: ARBucket;
}