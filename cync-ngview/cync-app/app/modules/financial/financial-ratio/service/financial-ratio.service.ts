import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { AllFinancialRatio, FinancialRatio, FinancialGraphRatioReport } from '../model/financial-ratio.model';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';
import { CyncConstants } from '@cyncCommon/utils/constants';


@Injectable()
export class FinancialRatioService {
	constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper) { }

    /***
    * This method is used to get all the FinancialRato
    */
	getAllFinancialRatio(url: string): Observable<AllFinancialRatio> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<AllFinancialRatio>JSON.parse(data._body)));
	}

    /***
     * This method is used to post all the FinancialRato
     */

	createAllFinancialRatio(url: string, model: FinancialRatio): Observable<any> {
		return this._cyncHttpService.postService(CyncConstants.FINANCE_HOST, url, model);
	}


    /***
     * This method is used to get all the FinancialRato by id
     */

	getFinancialRatoById(url: string): Observable<AllFinancialRatio> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<AllFinancialRatio>JSON.parse(data._body)));
	}


    /***
     * This method is used to get all the FinancialRato
     */
	updateFinancialRato(url: string, model: AllFinancialRatio): Observable<any> {
		return this._cyncHttpService.putService(CyncConstants.FINANCE_HOST, url, model);
	}

    /***
        * This method is used to get Financial Ratio Summary Graph
        */
	getServiceGraph(url: string): Observable<FinancialGraphRatioReport> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<FinancialGraphRatioReport>JSON.parse(data._body)));

	}

	getBorrowerDetails(url: string): Observable<any> {
		return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
	}

	getRatioCategories(url: string): Observable<any> {
		return this._cyncHttpService.get(url).map(data => JSON.parse(data._body));
	}
}
