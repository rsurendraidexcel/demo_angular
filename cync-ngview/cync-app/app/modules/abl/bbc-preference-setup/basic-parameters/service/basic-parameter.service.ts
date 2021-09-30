import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Helper } from '@cyncCommon/utils/helper'
import { Observable } from 'rxjs/Observable';
import { BBCOptions, BorrowerDetailsAPIResponse, BorrowerParameterAPIResponse } from '../model/basic-parameters.model'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { APIMapper } from '@cyncCommon/utils/apimapper';
import { SelectDropDown } from '@app/shared/models/select-dropdown.model'

@Injectable()
export class BasicParameterService {

    constructor(private _cyncHttpService: CyncHttpService, private _helper: Helper, private _apiMapper: APIMapper) { }

    /**
     * This method will get the borrower details what he has selected already
     * @param url 
     * @param borrowerId
     * @returns Observable<BorrowerDetailsAPIResponse>
     */
    public getBorrowerDetails(borrowerId: string): Observable<BorrowerDetailsAPIResponse> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_DETAILS];
        endPoint = endPoint.replace('{selectedClientId}', borrowerId);
        return this._cyncHttpService.get(endPoint).map(data => this.customizeGetBorrowerDetails(JSON.parse(data._body)));
    }

    /**
     * this method will customize the api response that need in component to show on UI
     * @param apiResponse
     * @returns BorrowerDetailsAPIResponse
     */
    private customizeGetBorrowerDetails(apiResponse: any): BorrowerDetailsAPIResponse {
        apiResponse.borrower.bbc_frequency_date = this._helper.convertStringToDate(apiResponse.borrower.bbc_frequency_date);
        return <BorrowerDetailsAPIResponse>apiResponse;
    }

    /**
     * This method will return the BBC options for borrowers
     * its commong api for all borrowers
     * @param borrowerId
     * @returns @link 
     */
    public getBBCOptionDetails(borrowerId: string): Observable<BBCOptions> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_CLIENT_BBC_OPTIONS];
        endPoint = endPoint.replace('{selectedClientId}', borrowerId);
        return this._cyncHttpService.get(endPoint).map(data => (<BBCOptions>JSON.parse(data._body)));
    }

    /**
     * This method will return basic parameters of the requested borrower based on borrower id
     * @param borrowerId 
     * @link BorrowerParameterAPIResponse
     * @returns BorrowerParameterAPIResponse 
     */
    public getBorrowerBasicParameters(borrowerId: string): Observable<BorrowerParameterAPIResponse> {
        let endPoint = this._apiMapper.endpoints[CyncConstants.GET_BORROWER_BASIC_PARAMETERS];
        endPoint = endPoint.replace('{selectedClientId}', borrowerId);
        return this._cyncHttpService.get(endPoint).map(data => (<BorrowerParameterAPIResponse>JSON.parse(data._body)));
    }

    /**
     * this method will get select drop down for html labeled with "BBC Frequency"
     */
    public getBBCFrequencyDropDown(): Observable<SelectDropDown[]> {
        const allDropdowns = new Array<SelectDropDown>();
        let apiResponse = [
            { id: 'M', name: 'Monthly' },
            { id: 'B', name: 'Bi-Weekly' },
            { id: 'W', name: 'Weekly' },
            { id: 'D', name: 'Daily' },
            { id: 'O', name: 'On Demand' },
        ];
        apiResponse.forEach(eachObj => {
            const dropdown = new SelectDropDown(eachObj.id, eachObj.name);
            allDropdowns.push(dropdown);
        });
        return Observable.of(JSON.parse(JSON.stringify(allDropdowns)));
    }

}

//new SelectDropDown('','');
