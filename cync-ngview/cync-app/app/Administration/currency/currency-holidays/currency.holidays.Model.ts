
export class currencyHolidayModel {
  recordTotal: number;
  offset: number;
  currencies: Array<Currencydetails>;
}

export class Currencydetails {
	id: string | '';
	currencyDescription: string | '';
}

export class currencyHolidaysModel {

	  currency: Currencydetails | {};
	  year: number | 0;
	  holidayDescription: string | '';
	  fromDate: Date;
	  toDate: Date;
	  holidaysStatus: boolean | true;
	  recurring: boolean | true;
	  status: string | '';
	  approverComments: string | '';
	  weekend: string[] | ['Saturday', 'Sunday'];
}

