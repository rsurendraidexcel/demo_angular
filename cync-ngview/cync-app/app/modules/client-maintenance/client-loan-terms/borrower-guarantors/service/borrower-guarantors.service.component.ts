import { Injectable } from '@angular/core';
import { CyncHttpService } from '@cyncCommon/services/custom.http.service'
import { Observable } from 'rxjs/Observable';
import { Country, UpdateRequestBody, State, NaicsCodeCombined, NaicsCode, CorporateType, BorrowerGuarantors } from '../model/borrower-guarantors.model.component'
import { Helper } from '@cyncCommon/utils/helper'
import { APIMapper } from '@cyncCommon/utils/apimapper'
import { CyncConstants } from '@cyncCommon/utils/constants'
import { SelectDropDown } from '@app/shared/models/select-dropdown.model';

/**
* @author - Lavish
* 
*/
@Injectable()
export class BorrowerGuarantorsService {
    constructor(
        private _cyncHttpService: CyncHttpService,
        private _helper: Helper,
        private _apiMapper: APIMapper,

    ) { }

    apiEndpoint: string = '';

    /**
    * Method to get api end point
    * 
    */
    getApiEndpoint() {
        return this.apiEndpoint;
    }

    /**
    * Method to set the api endpoint for country api
    * 
    */
    setCountriesListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_COUNTRIES_LIST];
    }

    /**
    * Method to get the country list
    * @returns - countries List
    */
    getCountriesList(): Observable<Country[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return <Country[]>JSON.parse(data._body);
        })
    }

    /**
    * Method to set the api endpoint for states api
    * 
    */
    setStatesListApiEndpoint(countryId: number) {
        this.apiEndpoint = this._helper.replaceEndpointQueryParameters(
            this._apiMapper.endpoints[CyncConstants.GET_STATES_LIST_BY_COUNTRY], CyncConstants.SELECTED_COUNTRY_ID_PARAM, countryId);
    }

    /**
    * Method to get the state list
    * @returns - state List
    */
    getStatesListBasedOnSelectedCountry(): Observable<State[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return <State[]>JSON.parse(data._body);
        })
    }

    /**
    * Method to set the api endpoint for naics codes api
    * 
    */
    setNaicsCodeListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_NAICS_CODE_LIST];
    }

    /**
    * Method to get the naics codes list
    * @returns - naics List
    */
    getNaicsCodeList(): Observable<NaicsCode[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return (<NaicsCode[]>this.serializeNaicsCodeListObject(JSON.parse(data._body)));
        })
    }

    /**
    * Method to serialize the naics codes list
    * @returns - naics codes
    */
    serializeNaicsCodeListObject(naicsCodeListResponse: NaicsCode): NaicsCode[] {
        return naicsCodeListResponse['naics_code'];
    }

    /**
    * Method to set the api endpoint for corporate list api
    * 
    */
    setCotporateListApiEndpoint() {
        this.apiEndpoint = this._apiMapper.endpoints[CyncConstants.GET_CORPORATE_LIST];
    }

    /**
    * Method to get the corporate list
    * @returns - corporate type List
    */
    getCorporateList(): Observable<CorporateType[]> {
        return this._cyncHttpService.get(this.getApiEndpoint()).map(data => {
            return <CorporateType[]>JSON.parse(data._body)['corporate_type'];
        })
    }

    /**
    * Method to get the data
    * 
    */
    getDetails(url: string): Observable<BorrowerGuarantors> {
        return this._cyncHttpService.get(url).map(data => <BorrowerGuarantors>JSON.parse(data._body));
    }

    /**
     * post or save the data
     * 
     */
    saveNew(endpoint: string, model: UpdateRequestBody): Observable<any> {
        return this._cyncHttpService.post(endpoint, model);
    }

    /**
    * update or patch method
    * 
    */
    updateDetails(endpoint: string, model: UpdateRequestBody): Observable<any> {
        return this._cyncHttpService.patch(endpoint, model);
    }

    /*     getCombinedNaicsCode():NaicsCodeCombined[]{
            let naicsCodeArr: NaicsCodeCombined[] = [];
            this.setNaicsCodeListApiEndpoint();
            this.getNaicsCodeList().subscribe(naicsCodeResp => {
                let tmpNaicsArr: NaicsCode[] = naicsCodeResp;
                tmpNaicsArr.forEach((data) =>{
                    let tmpArr:string[] = [];
                    tmpArr.push(data.code);
                    tmpArr.push(data.description);
                    let tmpObj: NaicsCodeCombined = {
                        "id": data.id,
                        "naics_code": tmpArr.join(',')
                    }
                    naicsCodeArr.push(tmpObj);
                });
            });
            return naicsCodeArr;
        }
    
        searchForNaicsCode(query:any, naicsCodeList: NaicsCodeCombined[]): NaicsCodeCombined[]{
            let filtered: NaicsCodeCombined[] = [];
            naicsCodeList.forEach((data) =>{
                if(data.naics_code.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                    filtered.push(data);
                }
            })
            return filtered;
        } */

}