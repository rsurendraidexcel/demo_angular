/**
* UDF Name model
*/
export class UDFModel {
    id: number;
    name: string;
}

/**
* UDF Value model
*/
export class UDFValueModel {
    udf_values: string[];
}

/**
* Client model
*/
export class ClientModel {
    id: string;
    client_name: string;
}

/**
* Transfer clients request body model
*/
export class TransferClientsRequestBody {
    udf_details: TransferClients[];
    constructor() { }
}

/**
 * Transfer clients sub model
*/
export class TransferClients {
    udf_id: number;
    udf_value: string;
    clients: string[];
}