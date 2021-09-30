export class currencyPairModel{

	currencyIdBase: currencyIdBase;
	currencyIdTo: currencyIdTo;
	currencyIdThru: currencyIdThru;
	quotationMethod: string | '';
	noOfUnits: number | 0;
	spreadDefinition: string |'';
	pointsMultiplier: number;
	thruCurrency: boolean | false;
	status: string | '';
	approverComments: string | '';
}

class currencyIdBase{
	id: string | '';
}
class currencyIdTo{
	id: string | '';
}
class currencyIdThru{
	id: string | '';
}
