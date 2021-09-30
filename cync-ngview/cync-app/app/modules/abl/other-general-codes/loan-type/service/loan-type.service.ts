import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { LoanTypeModel, UpdateRequestBody } from '../model/loan-type.model'
import { Helper } from '@cyncCommon/utils/helper'

@Injectable()
export class LoanTypeService {
	constructor(
		private _cyncHttpService: CyncHttpService,
		private _helper: Helper
	) { }

	/**
	* Method to get loan type value by ID
	* 
	*/
	getLoanTypeById(url: string): Observable<any> {
		return this._cyncHttpService.getService('MCL', url).map(data => <any>JSON.parse(data._body));
	}

	/**
    * This method updates existing Loan Type
	* @param url
	* @param model
    */
	updateLoanType(url: string, model: UpdateRequestBody): Observable<any> {
		return this._cyncHttpService.putService('MCL', url, model);
	}

    /**
    * This method saves the new Loan Type
    * @param url
    * @param model
    */
	saveLoanType(url: string, model: UpdateRequestBody): Observable<any> {
		return this._cyncHttpService.postService('MCL', url, model);
	}
}