/**
 * curreny code details 
 */
export class CurrencyCode {
    id: number;
    currency_cd: string;
    description: string;
    decimal_precision: string;
    system_defined: boolean;
}

/**
 * tp update currency code 
 */
export class UpdateCurrencyCode {
    currency: CurrencyCode;
}


