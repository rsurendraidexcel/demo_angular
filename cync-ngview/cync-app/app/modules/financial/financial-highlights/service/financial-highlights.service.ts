import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service';
import { Observable } from 'rxjs/Observable';
import { Helper } from '@cyncCommon/utils/helper';
import { highlightsModel } from '../model/financial-highlights.model';
import { CyncConstants } from '@cyncCommon/utils/constants';


@Injectable()
export class FinancialHighlightsService {
	constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper) { }


    /***
    * This method is used to get Financial Ratio Summary Graph
    */
	getHighlightsData(url: string): Observable<highlightsModel> {
		return this._cyncHttpService.getService(CyncConstants.FINANCE_HOST, url).map(data => (<highlightsModel>JSON.parse(data._body)));

	}
}
