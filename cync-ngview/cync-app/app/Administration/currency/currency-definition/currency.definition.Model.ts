
export class currencyDefinitionModel {
  recordTotal: number;
  offset: number;
  currencies: Array<Currencies>;
}

export class Currencies  {
	id: string;
    currencyName: string;
    currencyDescription: string;
    currencyCode: string;
    ccyCountry: Country;
    currencyDecimalPrecision: number;
    currencyRoundingUnit: number;
    currencyRoundingPrefs: RoundingPref;
    currencyCutoffTime: string;
    currencyInterestMethod: InterestMethod;
    lenderId: number;
    currencyFormatMask: FormatMask;
}

export class Country  {
	id: string;
	countryName: string;
}

export class RoundingPref  {
	id: string;
	name: string;
}

export class InterestMethod  {
	id: string;
	intMethName: string;
}

export class  FormatMask {
  id: string;
  formatMaskName: string;
}

export class CurrencyPostModel{

  currencyName: string | '';
  currencyDescription: string | '';
  currencyCode: string | '';
  currencyFormatMask: FormatMask |{};
  ccyCountry: Country | {};
  currencyDecimalPrecision: number | 0;
  currencyRoundingUnit: number | 0;
  currencyRoundingPrefs: RoundingPref | {} ;
  currencyCutoffTime: string ;
  currencyInterestMethod: InterestMethod | {};
  beforeDecimal: string | 'Dollar';
  afterDecimal: string | 'cents';
  currSymbo: string | '$' ;
  currSymBefAmt: boolean |true;
  status: string | '';
  approverComments: string | '';

}
