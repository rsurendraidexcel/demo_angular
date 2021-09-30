import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { CurrencyCode, UpdateCurrencyCode } from '../model/currency-code.model'
import { Helper } from '@cyncCommon/utils/helper'


@Injectable()
export class CurrencyCodeService {
    constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper, ) { }

    /**
     * this method is to get currency code details for requested currency code 
     */
    getCurrenyCodeDetails(endpoint: string): Observable<CurrencyCode> {
        return this._cyncHttpService.get(endpoint).map(data => <CurrencyCode>JSON.parse(data._body));
    }

    /**
     * this method will save new currency code
     * @param endpoint 
     * @param model 
     */
    saveCurrencyCode(endpoint: string, model: UpdateCurrencyCode) {
        return this._cyncHttpService.post(endpoint, model);
    }

    /**
     * this method will update currency code
     * @param endpoint 
     * @param model 
     */
    updateCurrencyCode(endpoint: string, model: UpdateCurrencyCode) {
        return this._cyncHttpService.patch(endpoint, model);
    }h



}